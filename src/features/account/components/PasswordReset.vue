<script setup lang="ts">
	import { ref, Ref, computed } from "vue";

	// API
	import { useQuery } from "@/lib/query_cache/useQuery";

	// Composables
	import { trackEvent } from "@/lib/analytics/useAnalytics";

	// UI
	import { PForm, PFormItem, PInput, PButton } from "@/ui";
	import { IUserPasswordResetResponse } from "@/features/api/userData.types";

	const props = defineProps({
		resetCode: {
			type: String,
			required: false,
			default: null,
		},
	});

	const inputCode: Ref<string | null> = ref(props.resetCode);
	const inputPassword: Ref<string | null> = ref(null);
	const isLoading: Ref<boolean> = ref(false);

	const requestResponse: Ref<IUserPasswordResetResponse | null> = ref(null);

	const canSend = computed(
		() =>
			!!(
				inputCode.value &&
				inputCode.value !== "" &&
				inputPassword.value &&
				inputPassword.value.length >= 8
			)
	);

	async function requestReset() {
		if (!canSend.value) return;

		isLoading.value = true;
		requestResponse.value = null;

		trackEvent("user_password_reset");

		await useQuery("PostUserPasswordReset", {
			code: inputCode.value!,
			password: inputPassword.value!,
		})
			.execute()
			.then((result) => (requestResponse.value = result))
			.finally(() => (isLoading.value = false));
	}
</script>

<template>
	<h2 class="text-white/80 font-bold text-lg font-mono">
		重置密码
	</h2>
	<div class="py-3 text-xs font-mono text-white/60">
		请输入发送到您邮箱的验证码以及新密码。
	</div>
	<div
		v-if="requestResponse"
		class="pb-3 text-xs font-mono"
		:class="
			requestResponse.status_code === 200
				? 'text-prunplanner'
				: 'text-red-600'
		">
		{{ requestResponse.message }}.
	</div>
	<div>
		<PForm>
			<PFormItem label="验证码">
				<PInput v-model:value="inputCode" class="w-full" />
			</PFormItem>
			<PFormItem label="新密码">
				<PInput
					v-model:value="inputPassword"
					type="password"
					class="w-full" />
				<template #info> 至少 8 个字符。 </template>
			</PFormItem>
			<PFormItem label="">
				<PButton
					:disabled="!canSend"
					:loading="isLoading"
					@click="requestReset">
					提交请求
				</PButton>
			</PFormItem>
		</PForm>
	</div>
</template>
