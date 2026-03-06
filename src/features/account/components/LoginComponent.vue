<script setup lang="ts">
	import { ref, Ref, computed } from "vue";

	import { useUserStore } from "@/stores/userStore";

	const userStore = useUserStore();
	import router from "@/router";

	// UI
	import { PForm, PFormItem, PFormSeperator, PInput, PButton } from "@/ui";

	const inputUsername: Ref<string | null> = ref(null);
	const inputPassword: Ref<string | null> = ref(null);
	const isLoggingIn: Ref<boolean> = ref(false);
	const hasError: Ref<boolean> = ref(false);

	const canLogin = computed(() => {
		if (inputUsername.value === null || inputUsername.value.length < 3)
			return false;
		if (inputPassword.value === null || inputPassword.value.length < 8)
			return false;

		return true;
	});

	async function handleLogin(): Promise<void> {
		if (!canLogin.value) return;

		isLoggingIn.value = true;
		hasError.value = false;

		const result = await userStore.performLogin(
			inputUsername.value!,
			inputPassword.value!
		);

		isLoggingIn.value = false;

		if (!result) hasError.value = true;
		else {
			let urlParams = new URLSearchParams(window.location.search);

			// successfull login should redirect back to origin, if present
			if (urlParams.has("redirectTo") && urlParams.get("redirectTo")) {
				router.push({ path: urlParams.get("redirectTo")! });
			} else {
				router.push({ path: "/empire" });
			}
		}
	}
</script>

<template>
	<div class="mx-auto max-w-100">
		<div class="text-xl text-white font-bold font-mono pb-3">登录</div>
		<div v-if="hasError" class="pb-3 text-red-600">
			登录失败，请检查用户名和密码。
		</div>
		<PForm>
			<PFormSeperator>
				<div class="font-mono text-xs text-white/60 pb-3">
					使用 PRUNplanner 即表示您同意
					<router-link
						to="/imprint-tos"
						class="hover:cursor-pointer underline">
						服务条款。
					</router-link>
				</div>
			</PFormSeperator>
			<PFormItem label="用户名">
				<PInput v-model:value="inputUsername" class="w-full" />
			</PFormItem>
			<PFormItem label="密码">
				<PInput
					v-model:value="inputPassword"
					type="password"
					class="w-full" />
			</PFormItem>
			<PFormSeperator>
				<div class="font-mono text-xs text-white/60 py-3">
					忘记密码？点击
					<router-link
						to="/request-password-reset"
						class="hover:cursor-pointer underline">
						重置密码。
					</router-link>
				</div>
			</PFormSeperator>
			<PFormItem label="">
				<PButton
					:loading="isLoggingIn"
					:disabled="!canLogin"
					@click="handleLogin">
					登录
				</PButton>
			</PFormItem>
		</PForm>
	</div>
</template>
