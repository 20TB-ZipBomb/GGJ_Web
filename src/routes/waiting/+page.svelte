<script>
	import { goto } from "$app/navigation";
  import Spinner from "$lib/components/spinner.svelte";

  setTimeout(()=>{
    goto("job-form");
  }, 300);
</script>

<Spinner/>