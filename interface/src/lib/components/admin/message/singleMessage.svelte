<script lang="ts">
  export let message = {
    message_id: "e12cd458-7691-4aa1-b601-f51aacdc755b",
    user_id: "fa36bfbf-f72d-4901-9a7b-0f0a43985312",
    data: "CAONIMA",
    created_at: "2024-03-18T19:30:02Z",
  };
</script>

<tr>
  <th>
    <label>
      <input type="checkbox" class="checkbox checkbox-sm" />
    </label>
  </th>
  <td>
    <div class="flex items-center gap-3">
      <div>
        <div class="font-semibold">{message.data}</div>
      </div>
    </div>
  </td>
  <td>
    <!-- // TODO: replace this with our own API response -->
    {message.user_id}
  </td>
  <td>
    <!-- // TODO: replace this with our own API response -->
    {message.message_id}
  </td>
  <td>
    {message.created_at}
  </td>
</tr>
