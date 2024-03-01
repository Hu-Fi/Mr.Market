<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { UserResponse } from "@mixin.dev/mixin-node-sdk";
  import SingleUser from "$lib/components/admin/users/singleUser.svelte";

  let users: UserResponse[] = [
    {
      type: "user",
      user_id: "27788c37-9139-4b6f-b535-488bda185dc1",
      identity_number: "25566",
      phone: "",
      full_name: "Human",
      biography: "",
      avatar_url:
        "https://images.mixin.one/HvYGJsV5TGeZ-X9Ek3FEQohQZ3fE9LBEBGcOcn4c4BNHovP4fW4YB97Dg5LcXoQ1hUjMEgjbl1DPlKg1TW7kK6XP=s128",
      relationship: "",
      mute_until: "",
      created_at: "2023-01-27 21:23:42",
      is_verified: false,
      is_scam: false,
    },
    {
      type: "user",
      user_id: "27788c37-9139-4b6f-b535-488bda185dc1",
      identity_number: "25566",
      phone: "",
      full_name: "Human",
      biography: "",
      avatar_url:
        "https://mixin-images.zeromesh.net/96l-LTbahgBXnKfLRHtiQybyk9kpA-eVIMYnzs4twATFtIq3Ayvw5zRfhGrt5IOGqUxxJuFXINJMTNkRlWpnFVbsA4Ep6FAn0pWP=s128",
      relationship: "",
      mute_until: "",
      created_at: "2023-01-27 21:23:42",
      is_verified: false,
      is_scam: false,
    },
    {
      type: "user",
      user_id: "27788c37-9139-4b6f-b535-488bda185dc1",
      identity_number: "25566",
      phone: "",
      full_name: "Human",
      biography: "",
      avatar_url:
        "https://mixin-images.zeromesh.net/-oE4Jsi3aMIkxUPUsvDozyL8D0ccmPkggIdIDu1z8THDQyJcCIsbNwC4amFBiRlkQiLNNjiuMBsNw8sAnehTuI0=s128",
      relationship: "",
      mute_until: "",
      created_at: "2023-01-27 21:23:42",
      is_verified: false,
      is_scam: false,
    },
    {
      type: "user",
      user_id: "27788c37-9139-4b6f-b535-488bda185dc1",
      identity_number: "25566",
      phone: "",
      full_name: "Human",
      biography: "",
      avatar_url:
        "https://mixin-images.zeromesh.net/T0pGzs4lg7sIKIEIb1diV_8kbrG5R96dOQD7ukTwBmSxE_xwYayRihxQ2but5Ed3zOor9zcQ5Qq4bpyzVaj6FPxymRSc7fjC_l_E=s128",
      relationship: "",
      mute_until: "",
      created_at: "2023-01-27 21:23:42",
      is_verified: false,
      is_scam: false,
    },
    {
      type: "user",
      user_id: "27788c37-9139-4b6f-b535-488bda185dc1",
      identity_number: "25566",
      phone: "",
      full_name: "Human",
      biography: "",
      avatar_url:
        "https://mixin-images.zeromesh.net/zVDjOxNTQvVsA8h2B4ZVxuHoCF3DJszufYKWpd9duXUSbSapoZadC7_13cnWBqg0EmwmRcKGbJaUpA8wFfpgZA=s128",
      relationship: "",
      mute_until: "",
      created_at: "2023-01-27 21:23:42",
      is_verified: false,
      is_scam: false,
    },
  ];
</script>

<div class="overflow-x-auto">
  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        <th></th>
        <th>{$_("name")}</th>
        <th>{$_("last_update")}</th>
        <th>{$_("volume")}</th>
        <th>{$_("actions")}</th>
      </tr>
    </thead>
    <tbody>
      {#each users as user}
        <SingleUser {user} />
      {/each}
    </tbody>
  </table>
</div>
