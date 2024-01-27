enum MessageType {
	/**
	 * Client -> Server
	 */
	LOBBY_JOIN_ATTEMPT = 'lobby_join_attempt',
	/**
	 * Server -> Client
	 */
	CONNECTION_REJECTED = 'connection_rejected',
	/**
	 * Server -> Client
	 */
	GAME_START = 'game_start',
	/**
	 * Client -> Server
	 */
	JOB_SUBMITTED = 'job_submitted',
	/**
	 * Server -> Client
	 */
	PLAYER_ID = 'player_id',
	/**
	 * Server -> Client
	 */
	RECEIVED_CARDS = 'received_cards',
	/**
	 * Client -> Server
	 */
	CARD_DATA = 'card_data',
	/**
	 * Server -> Client
	 */
	TIMER_FINISHED = 'timer_finished',
	/**
	 * Client -> Server
	 */
	SCORE_SUBMISSION = 'score_submission'
}

/**
 * A message sent between the client and server.
 */
type Message = {
	message_type: MessageType;
};

type ConnectionRejectedMessage = Message & {
	message_type: MessageType.CONNECTION_REJECTED;
};

type LobbyJoinAttemptMessage = Message & {
	message_type: MessageType.LOBBY_JOIN_ATTEMPT;
	name: string;
	lobby_code: string;
};

type GameStartMessage = Message & {
	message_type: MessageType.GAME_START;
	number_of_jobs: number;
};

type JobSubmittedMessage = Message & {
	message_type: MessageType.JOB_SUBMITTED;
	job_input: string;
};

type PlayerIdMessage = Message & {
	message_type: MessageType.PLAYER_ID;
	player_id: string;
};

type ReceivedCardsMessage = Message & {
	message_type: MessageType.RECEIVED_CARDS;
	drawn_cards: Card[];
	job_card: Card;
};

type CardDataMessage = Message & {
	message_type: MessageType.CARD_DATA;
	card: Card;
};

type TimerFinishedMessage = Message & {
	message_type: MessageType.TIMER_FINISHED;
};

type ScoreSubmissionMessage = Message & {
	message_type: MessageType.SCORE_SUBMISSION;
	score_in_cents: number;
};

export type Card = {
	card_id: number;
	job_text: string;
};

export enum ClientState {
	MENU,
	CONNECTING,
	LOBBY,
	JOB_CREATION,
	JOB_CREATION_DONE,
	JOB_PICKING,
	JOB_PICKING_DONE,
	INTERVIEWER,
	VOTING,
	VOTING_DONE,
	INTERVIEWEE
}

export class JobbersWebClient {
	private _gameState: ClientState = ClientState.CONNECTING;
	private _jobsToCreateRemaining: number = 0;
	public cards: Card[] = [];
	private jobCard: Card = {
		card_id: -1,
		job_text: 'Unknown'
	};

	private get gameState() {
		return this._gameState;
	}

	private set gameState(value: ClientState) {
		this.onGameStateChanged(this._gameState, value);
		this._gameState = value;
	}

	private playerId: string = '';

	onGameJoinAttempFailed: (reason: string) => void = () => {};
	onGameEnded: () => void = () => {};
	onGameStateChanged: (oldGameState: ClientState, newGameState: ClientState) => void = () => {};
	onJobCardChanged: (jobCard: Card) => void = () => {};
	onCardsChanged: (cards: Card[]) => void = () => {};
	onError: () => void = () => {};

	websocket: WebSocket;

	constructor(serverAddress: string) {
		this.websocket = new WebSocket(serverAddress);
		this.websocket.onopen = this.onOpen;
		this.websocket.onclose = this.onClose;
		this.websocket.onerror = this.onWSError;
		this.websocket.onmessage = this.onMessage;
	}

	onOpen = (event: Event) => {
		console.log('Websocket opened');
	};

	onClose = (event: CloseEvent) => {
		console.log('Websocket closed');
	};

	onWSError = (event: Event) => {
		console.error(`Websocket error`);
		console.error(event);
		this.onError();
	};

	onMessage = (event: MessageEvent) => {
		let message: Message;
		try {
			message = JSON.parse(event.data);
		} catch (error) {
			console.error(`Error parsing message from server: ${error}`);
			return;
		}

		if (message.message_type == null) {
			console.error('Message type is null');
			return;
		}

		switch (message.message_type) {
			case MessageType.CONNECTION_REJECTED:
				this.onConnectionRejectedMessage(message as ConnectionRejectedMessage);
				break;
			case MessageType.GAME_START:
				this.onGameStartMessage(message as GameStartMessage);
				break;
			case MessageType.PLAYER_ID:
				this.onPlayerIdMessage(message as PlayerIdMessage);
				break;
			case MessageType.RECEIVED_CARDS:
				this.onReceivedCardsMessage(message as ReceivedCardsMessage);
				break;
			case MessageType.TIMER_FINISHED:
				this.onTimerFinishedMessage(message as TimerFinishedMessage);
				break;
			default:
				console.error('Unknown message type received: ' + message.message_type);
				break;
		}
	};

	onConnectionRejectedMessage = (message: ConnectionRejectedMessage) => {
		this.websocket.close();
		this.onGameJoinAttempFailed('No game found with that code');
	};

	onGameStartMessage = (message: GameStartMessage) => {
		if (this.gameState != ClientState.LOBBY) {
			console.error('Received game start message while not in lobby');
			return;
		}
		this.gameState = ClientState.JOB_CREATION;
		this._jobsToCreateRemaining = message.number_of_jobs;
	};

	onPlayerIdMessage = (message: PlayerIdMessage) => {
		if (this.gameState == ClientState.CONNECTING) {
			this.playerId = message.player_id;
			this.gameState = ClientState.LOBBY;
		} else if (
			this.gameState == ClientState.JOB_PICKING ||
			this.gameState == ClientState.JOB_PICKING_DONE
		) {
			if (this.playerId == message.player_id) {
				this.gameState = ClientState.INTERVIEWEE;
			} else {
				this.gameState = ClientState.INTERVIEWER;
			}
		} else {
			console.error(`Received player id message while in state ${this.gameState}`);
		}
	};

	onReceivedCardsMessage = (message: ReceivedCardsMessage) => {
		if (
			this.gameState != ClientState.JOB_CREATION &&
			this.gameState != ClientState.JOB_CREATION_DONE
		) {
			console.error('Received cards while not during or at the end of job creation');
			return;
		}
		this.cards = message.drawn_cards;
		this.jobCard = message.job_card;
		this.onJobCardChanged(this.jobCard);
		this.gameState = ClientState.JOB_PICKING;
	};

	onTimerFinishedMessage = (message: TimerFinishedMessage) => {
		if (this.gameState == ClientState.INTERVIEWER) {
			this.gameState = ClientState.VOTING;
		} else if (this.gameState == ClientState.INTERVIEWEE) {
			this.gameState = ClientState.VOTING;
		}
	};

	sendLobbyJoinAttempt = (name: string, lobbyCode: string) => {
		if (this.gameState != ClientState.CONNECTING) {
			console.error('Cannot join lobby when not in connecting state');
			return;
		}
		this.websocket.send(
			JSON.stringify({
				message_type: MessageType.LOBBY_JOIN_ATTEMPT,
				name: name,
				lobby_code: lobbyCode
			} as LobbyJoinAttemptMessage)
		);
	};

	createJob = (jobText: string) => {
		if (this.gameState != ClientState.JOB_CREATION) {
			console.error('Cannot create job when not in job creation state');
			return;
		}
		if (this._jobsToCreateRemaining <= 0) {
			console.error('Cannot create more jobs than specified in game start message');
			return;
		}
		this._jobsToCreateRemaining--;
		this.websocket.send(
			JSON.stringify({
				message_type: MessageType.JOB_SUBMITTED,
				job_input: jobText
			} as JobSubmittedMessage)
		);
		if (this._jobsToCreateRemaining == 0) {
			this.gameState = ClientState.JOB_CREATION_DONE;
		}
	};

	sendCardData = (card_id: number) => {
		if (this.gameState == ClientState.JOB_PICKING || this.gameState == ClientState.INTERVIEWER) {
			let card: Card | undefined = this.cards.find((c) => c.card_id == card_id);
			if (card == undefined) {
				console.error(`Cannot find card with id ${card_id}`);
				return;
			}
			this.cards.filter((c) => c.card_id != card_id);
			this.websocket.send(
				JSON.stringify({
					message_type: MessageType.CARD_DATA,
					card: card
				} as CardDataMessage)
			);
			this.onCardsChanged(this.cards);
			if (this.gameState == ClientState.JOB_PICKING) {
				this.gameState = ClientState.JOB_PICKING_DONE;
			}
		} else {
			console.error(`Cannot send card data when in state ${this.gameState}`);
		}
	};

	sendScoreSubmission = (salaryCents: number) => {
		if (this.gameState != ClientState.VOTING) {
			console.error(`Cannot submit score when not in voting state`);
			return;
		}
		this.websocket.send(
			JSON.stringify({
				message_type: MessageType.SCORE_SUBMISSION,
				score_in_cents: salaryCents
			} as ScoreSubmissionMessage)
		);
		this.gameState = ClientState.VOTING_DONE;
	};
}
