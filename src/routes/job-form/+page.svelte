<script>
  import JobForm from "$lib/components/job-form.svelte";
</script>

<JobForm on:jobSubmited={(e)=>{console.log(e.detail.title)}}/>