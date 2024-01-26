<script>
  import JobList from "$lib/components/job-list.svelte"
  let job = "";
</script>

<JobList jobs={[{title: "Fisher"}, {title: "Lawyer"}, {title: "Mechanic"}, {title: "Dark overlord"}]} on:jobSelected={(e)=>{job = e.detail.title}}/>


