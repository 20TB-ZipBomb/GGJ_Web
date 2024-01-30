export enum MessageType {
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
	 * Client -> Server
	 */
	INTERCEPT_CARD_DATA = 'intercept_card_data',
	/**
	 * Server -> Client
	 */
	TIMER_FINISHED = 'timer_finished',
	/**
	 * Client -> Server
	 */
	SCORE_SUBMISSION = 'score_submission',
	/**
	 * Client -> Server
	 */
	GAME_FINISHED = 'game_finished'
}

/**
 * A message sent between the client and server.
 */
export type Message =
	| ConnectionRejectedMessage
	| LobbyJoinAttemptMessage
	| GameStartMessage
	| JobSubmittedMessage
	| PlayerIdMessage
	| ReceivedCardsMessage
	| CardDataMessage
	| InterceptCardDataMessage
	| TimerFinishedMessage
	| ScoreSubmissionMessage
	| GameFinishedMessage;

export type ConnectionRejectedMessage = {
	message_type: MessageType.CONNECTION_REJECTED;
};

export type LobbyJoinAttemptMessage = {
	message_type: MessageType.LOBBY_JOIN_ATTEMPT;
	name: string;
	lobby_code: string;
};

export type GameStartMessage = {
	message_type: MessageType.GAME_START;
	number_of_jobs: number;
};

export type JobSubmittedMessage = {
	message_type: MessageType.JOB_SUBMITTED;
	job_input: string;
};

export type PlayerIdMessage = {
	message_type: MessageType.PLAYER_ID;
	player_id: string;
};

export type ReceivedCardsMessage = {
	message_type: MessageType.RECEIVED_CARDS;
	drawn_cards: Card[];
	job_card: Card;
};

export type CardDataMessage = {
	message_type: MessageType.CARD_DATA;
	card: Card;
};

export type InterceptCardDataMessage = {
	message_type: MessageType.INTERCEPT_CARD_DATA;
	card: Card;
};

export type TimerFinishedMessage = {
	message_type: MessageType.TIMER_FINISHED;
};

export type ScoreSubmissionMessage = {
	message_type: MessageType.SCORE_SUBMISSION;
	score_in_cents: number;
};

export type GameFinishedMessage = {
	message_type: MessageType.GAME_FINISHED;
};

export type Card = {
	card_id: string;
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
	INTERVIEWEE,
	INTERVIEWER,
	VOTING,
	VOTING_DONE,
	GAME_FINISHED
}

export class JobbersWebClient {
	private _clientState: ClientState = ClientState.CONNECTING;
	private _jobsToCreateRemaining: number = 0;
	public cards: Card[] = [];
	public jobCard: Card = {
		card_id: '-1',
		job_text: 'Unknown'
	};

	private get clientState() {
		return this._clientState;
	}

	private set clientState(value: ClientState) {
		this.onGameStateChanged(value);
		this._clientState = value;
	}

	private roomCode: string = '';
	private playerName: string = '';
	private playerId: string = '';

	private websocket: WebSocket;

	public onGameJoinAttempFailed: (reason: string) => void = () => {};
	public onGameStarted: (jobsToMake: number) => void = () => {};
	public onGameStateChanged: (newGameState: ClientState) => void = () => {};
	public onCardsChanged: (cards: Card[]) => void = () => {};
	public onError: () => void = () => {};

	private stateHandlers: Map<ClientState, (message: Message) => void> = new Map()
		.set(ClientState.CONNECTING, (message: Message) => {
			if (message.message_type == MessageType.CONNECTION_REJECTED) {
				this.websocket.close();
				this.onGameJoinAttempFailed('No game found with that code');
				this.clientState = ClientState.MENU;
			} else if (message.message_type == MessageType.PLAYER_ID) {
				this.playerId = message.player_id;
				this.clientState = ClientState.LOBBY;
			}
		})
		.set(ClientState.LOBBY, (message: Message) => {
			if (message.message_type == MessageType.GAME_START) {
				this._jobsToCreateRemaining = message.number_of_jobs;
				this.onGameStarted(message.number_of_jobs);
				this.clientState = ClientState.JOB_CREATION;
			}
		})
		.set(ClientState.JOB_CREATION_DONE, (message: Message) => {
			if (message.message_type == MessageType.RECEIVED_CARDS) {
				this.cards = message.drawn_cards;
				this.jobCard = message.job_card;
				this.clientState = ClientState.JOB_PICKING;
			}
		})
		.set(ClientState.JOB_PICKING_DONE, (message: Message) => {
			if (message.message_type == MessageType.PLAYER_ID) {
				if (this.playerId == message.player_id) {
					this.clientState = ClientState.INTERVIEWEE;
				} else {
					this.clientState = ClientState.INTERVIEWER;
				}
			}
		})
		.set(ClientState.INTERVIEWER, (message: Message) => {
			if (message.message_type == MessageType.TIMER_FINISHED) {
				this.clientState = ClientState.VOTING;
			}
		})
		.set(ClientState.INTERVIEWEE, (message: Message) => {
			if (message.message_type == MessageType.TIMER_FINISHED) {
				this.clientState = ClientState.VOTING_DONE;
			}
		})
		.set(ClientState.VOTING_DONE, (message: Message) => {
			if (message.message_type == MessageType.PLAYER_ID) {
				if (this.playerId == message.player_id) {
					this.clientState = ClientState.INTERVIEWEE;
				} else {
					this.clientState = ClientState.INTERVIEWER;
				}
			} else if (message.message_type == MessageType.GAME_FINISHED) {
				this.clientState = ClientState.GAME_FINISHED;
			}
		});

	constructor(serverAddress: string, roomCode: string, playerName: string) {
		this.roomCode = roomCode;
		this.playerName = playerName;
		this.websocket = new WebSocket(serverAddress);
		this.websocket.onopen = this.onOpen;
		this.websocket.onclose = this.onClose;
		this.websocket.onerror = this.onWSError;
		this.websocket.onmessage = this.onMessage;
	}

	private onOpen = (event: Event) => {
		console.log('Websocket opened');
		this.sendLobbyJoinAttempt(this.playerName, this.roomCode);
	};

	private onClose = (event: CloseEvent) => {
		console.log('Websocket closed');
	};

	private onWSError = (event: Event) => {
		console.error(`Websocket error`);
		console.error(event);
		this.onError();
	};

	private onMessage = (event: MessageEvent) => {
		let message: Message;
		try {
			message = JSON.parse(event.data);
			console.log(message);
		} catch (error) {
			console.error(`Error parsing message from server: ${error}`);
			return;
		}

		if (message.message_type == null) {
			console.error('Message type is null');
			return;
		}

		if (this.stateHandlers.has(this.clientState)) {
			this.stateHandlers.get(this.clientState)!(message);
		} else {
			console.error(`No handler for state ${this.clientState}`);
		}
	};

	public sendLobbyJoinAttempt = (name: string, lobbyCode: string) => {
		if (this.clientState != ClientState.CONNECTING) {
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

	public createJob = (jobText: string) => {
		if (this.clientState != ClientState.JOB_CREATION) {
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
			this.clientState = ClientState.JOB_CREATION_DONE;
		}
	};

	public sendCardData = (card_id: string) => {
		if (this.clientState == ClientState.JOB_PICKING) {
			let card: Card | undefined = this.cards.find((c) => c.card_id == card_id);
			if (card == undefined) {
				console.error(`Cannot find card with id ${card_id}`);
				return;
			}
			this.cards = this.cards.filter((c) => c.card_id != card_id);
			this.websocket.send(
				JSON.stringify({
					message_type: MessageType.CARD_DATA,
					card: card
				} as CardDataMessage)
			);
			this.onCardsChanged(this.cards);
			this.clientState = ClientState.JOB_PICKING_DONE;
		} else {
			console.error(`Cannot send card data when in state ${this.clientState}`);
		}
	};

	public sendInterceptCardData = (card_id: string) => {
		if (this.clientState != ClientState.INTERVIEWER) {
			console.error(`Cannot send intercept card data when not in interviewer state`);
			return;
		}
		let card: Card | undefined = this.cards.find((c) => c.card_id == card_id);
		if (card == undefined) {
			console.error(`Cannot find card with id ${card_id}`);
			return;
		}
		this.cards = this.cards.filter((c) => c.card_id != card_id);
		this.websocket.send(
			JSON.stringify({
				message_type: MessageType.INTERCEPT_CARD_DATA,
				card: card
			} as InterceptCardDataMessage)
		);
		this.onCardsChanged(this.cards);
	};

	public sendScoreSubmission = (salaryCents: number) => {
		if (this.clientState != ClientState.VOTING) {
			console.error(`Cannot submit score when not in voting state`);
			return;
		}
		this.websocket.send(
			JSON.stringify({
				message_type: MessageType.SCORE_SUBMISSION,
				score_in_cents: salaryCents
			} as ScoreSubmissionMessage)
		);
		this.clientState = ClientState.VOTING_DONE;
	};
}
