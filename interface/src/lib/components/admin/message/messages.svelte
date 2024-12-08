<script>
  import { _ } from "svelte-i18n";
  import SingleMessage from "./singleMessage.svelte";

  const messages = [
    {
      message_id: "e12cd458-7691-4aa1-b601-f51aacdc755b",
      user_id: "fa36bfbf-f72d-4901-9a7b-0f0a43985312",
      data: "Hello, world!",
      created_at: "2024-03-18T19:30:02Z",
    },
    {
      message_id: "e12cd458-7691-4aa1-b601-f51aacdc755b",
      user_id: "fa36bfbf-f72d-4901-9a7b-0f0a43985312",
      data: "Hello, world!",
      created_at: "2024-03-18T19:30:02Z",
    },
    {
      message_id: "e12cd458-7691-4aa1-b601-f51aacdc755b",
      user_id: "fa36bfbf-f72d-4901-9a7b-0f0a43985312",
      data: "Hello, world!",
      created_at: "2024-03-18T19:30:02Z",
    },
  ]
</script>

<div class="overflow-x-auto mt-8">
  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        <th></th>
        <th>{$_("data")}</th>
        <th>{$_("user_id")}</th>
        <th>{$_("message_id")}</th>
        <th>{$_("created_at")}</th>
      </tr>
    </thead>
    <tbody>
      {#each messages as message}
        <SingleMessage {message} />
      {/each}
    </tbody>
  </table>
</div>

