<script lang="ts">
  import queryString from "query-string";
  import parse from "url-parse";

  const query = queryString.parse(location.search);
  const action = JSON.parse(window.decodeURI(query.q as string));
  const whitelists = ["tradetrust.io","tradetrust-website.netlify.app"];
  let valid;
  let timer = 3;
  let interval: any;

  const getDomain = (hostname: string) => {
    const parts = hostname.split(".").reverse();

    if (parts[1] === "netlify" && parts[0] === "app") {
    return parts[2] + "." + parts[1] + "." + parts[0];
  }

    return parts[1] + "." + parts[0];
  };

  // use parse to ignore protocols, path, etc...
  $: valid = action.payload.redirect && whitelists.includes(getDomain(parse(action.payload.redirect).hostname));

  $: if (valid && !interval) {
    interval = setInterval(() => {
      timer--;
    }, 1000);
  }
  $: if (timer === 0) {
    clearInterval(interval);
    window.location.href = `${action.payload.redirect}${location.search}${window.location.hash}`;
  }
  /**
   *
  http://localhost:9000/?q=%7B%22type%22:%22DOCUMENT%22,%22payload%22:%7B%22uri%22:%22https://api-vaccine.storage.staging.notarise.io/document/6cfbbcbf-85a1-4644-b61a-952c12376502%22,%22permittedActions%22:%5B%22VIEW%22,%22STORE%22%5D,%22redirect%22:%22https://www.tradetrust.io/verify%22%7D%7D#%7B%22key%22:%222b1236683c3a842ed4a0bb032c1cf668e24bcaf8ce599aeef502c93cb628152c%22%7D
   */
</script>
<main>
  {#if valid}
    <div class="container">
      <div class="text">
        Redirecting to
        <span class="success">{action.payload.redirect}</span>
        in {timer}
      </div>
      <div class="img-container">
        <img src="./undraw_online_transactions_02ka.png" class="icon" alt="redirect" />
      </div>
    </div>
  {:else}
    <div class="container">
      <div class="text">
        {#if action.payload.redirect}
          <span class="error">{action.payload.redirect}</span>
          <br />
          is not an authorized platform.
        {:else}
          <span class="error">No platform specified</span>
        {/if}
      </div>
      <div class="img-container">
        <img src="./undraw_cancel_u1it.png" class="icon" alt="redirect" />
      </div>
    </div>
  {/if}
</main>
