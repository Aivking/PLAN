<script setup lang="ts">
	import { ComputedRef, computed, Ref, ref } from "vue";

	// API
	import { useQuery } from "@/lib/query_cache/useQuery";

	// Composables
	import { trackEvent } from "@/lib/analytics/useAnalytics";

	// UI
	import { PForm, PFormItem, PInput, PButton } from "@/ui";

	const refCurrentPassword: Ref<string> = ref("");
	const refNewPassword: Ref<string> = ref("");

	const isChanging: Ref<boolean> = ref(false);
	const changeStatus: Ref<boolean | null> = ref(null);

	const canChange: ComputedRef<boolean> = computed(
		() =>
			!!(
				refCurrentPassword.value &&
				refCurrentPassword.value !== "" &&
				refNewPassword.value &&
				refNewPassword.value !== "" &&
				refCurrentPassword.value.length >= 8 &&
				refNewPassword.value.length >= 8
			)
	);

	async function patchPassword(): Promise<void> {
		isChanging.value = true;

		trackEvent("user_password_change");

		await useQuery("PatchUserChangePassword", {
			old_password: refCurrentPassword.value,
			new_password: refNewPassword.value,
		})
			.execute()
			.then((result: boolean) => {
				changeStatus.value = result;
			})
			.finally(() => {
				isChanging.value = false;
				refCurrentPassword.value = "";
				refNewPassword.value = "";
			});
	}
</script>

<template>
	<div>
		<div class="flex flex-row flex-wrap gap-3">
			<h2 class="grow my-auto text-white/80 font-bold text-lg">
				修改密码
			</h2>
			<PButton
				:disabled="!canChange"
				:loading="isChanging"
				@click="patchPassword">
				修改密码
			</PButton>
		</div>
		<div class="py-3 text-white/60">
			密码至少需要 8 个字符。
		</div>
		<template v-if="changeStatus !== null">
			<div
				v-if="changeStatus"
				class="mb-3 py-1 px-2 bg-prunplanner text-black">
				密码修改成功。
			</div>
			<div v-else class="mb-3 py-1 px-2 bg-red-600 text-white">
				密码修改失败。
			</div>
		</template>
		<PForm>
			<PFormItem label="Current Password">
				<PInput
					v-model:value="refCurrentPassword"
					type="password"
					class="w-full min-w-50 max-w-[50%]" />
			</PFormItem>
			<PFormItem label="New Password">
				<PInput
					v-model:value="refNewPassword"
					type="password"
					class="w-full min-w-50 max-w-[50%]" />
			</PFormItem>
		</PForm>
	</div>
</template>
