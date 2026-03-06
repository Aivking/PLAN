<script setup lang="ts">
	import { useHead } from "@unhead/vue";

	useHead({
		title: "重置密码 | PRUNplanner",
	});

	import RequestPasswordReset from "@/features/account/components/RequestPasswordReset.vue";
</script>

<template>
	<div class="flex justify-center items-center p-10">
		<div class="w-100 py-2 px-4 border border-white/10">
			<RequestPasswordReset />
		</div>
	</div>
</template>
