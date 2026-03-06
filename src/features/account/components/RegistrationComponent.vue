<script setup lang="ts">
	import { onMounted, ref, Ref, computed, ComputedRef } from "vue";

	import { PForm, PFormItem, PFormSeperator, PButton, PInput } from "@/ui";
	import { IUserRegistrationPayload } from "@/features/api/userData.types";
	import { useQuery } from "@/lib/query_cache/useQuery";

	const isLoading = ref(false);
	const hasError = ref(false);
	const hasErrorMessage: Ref<string | null> = ref(null);
	const registrationSuccess = ref(false);
	const registrationUsername: Ref<string | null> = ref(null);

	const inputUsername: Ref<string | null> = ref(null);
	const inputPassword: Ref<string | null> = ref(null);
	const inputEmail: Ref<string | null> = ref(null);
	const inputPlanetName: Ref<string | null> = ref(null);
	const activeSecurityOption: Ref<string | null> = ref(null);

	const securityOptionList = [
		"OT-580b",
		"KW-688c",
		"ZV-759c",
		"ZV-896b",
		"FK-794b",
		"UV-351c",
		"RC-040b",
		"OT-442b",
		"KW-020c",
	];

	function randomSecurityOption() {
		activeSecurityOption.value =
			securityOptionList[
				Math.floor(Math.random() * securityOptionList.length)
			];
	}

	const canRegister = computed(() => {
		// username at least 3 characters, no spaces
		if (
			inputUsername.value === null ||
			inputUsername.value.length < 3 ||
			inputUsername.value.includes(" ")
		)
			return false;

		// password at least 8 characters
		if (inputPassword.value === null || inputPassword.value.length < 8)
			return false;

		// planetname must be filled
		if (inputPlanetName.value === null || inputPlanetName.value === "")
			return false;

		return true;
	});

	const registrationPayload: ComputedRef<IUserRegistrationPayload> = computed(
		() => ({
			username: inputUsername.value ?? "",
			password: inputPassword.value ?? "",
			planet: inputPlanetName.value ?? "",
			randomplanet: activeSecurityOption.value ?? "",
			...(inputEmail.value ? { email: inputEmail.value } : {}),
		})
	);

	async function registerUser(): Promise<void> {
		isLoading.value = true;
		hasError.value = false;
		registrationSuccess.value = false;
		hasErrorMessage.value = null;

		try {
			const data = await useQuery(
				"PostUserRegistration",
				registrationPayload.value
			).execute();
			registrationUsername.value = data.username;
			registrationSuccess.value = true;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			// error message is string
			const match = err.message.match(/{.*}$/);
			if (match) {
				hasErrorMessage.value = JSON.parse(match[0]).detail;
			}
			hasError.value = true;
			randomSecurityOption();
		} finally {
			isLoading.value = false;
		}
	}

	onMounted(() => randomSecurityOption());
</script>

<template>
	<div class="mx-auto max-w-100">
		<template v-if="registrationSuccess">
			<div>
				<div class="text-xl text-white font-bold font-mono pb-1">
					欢迎，{{ registrationUsername }}！
				</div>
				<div class="pt-3">
					注册成功，您现在可以登录 PRUNplanner 了。
				</div>
			</div>
		</template>
		<template v-else>
			<div class="text-xl text-white font-bold font-mono pb-1">
				账号信息
			</div>
			<div class="pb-3 text-white/60 text-xs font-mono">
				PRUNplanner 免费使用。创建账号即表示您同意
				<router-link
					to="/imprint-tos"
					class="underline hover:text-link-primary">
					服务条款。
				</router-link>
			</div>
			<div v-if="hasError" class="pb-3 text-red-600">
				注册失败。
				{{ hasErrorMessage }}
			</div>
			<PForm>
				<PFormItem label="用户名">
					<PInput v-model:value="inputUsername" class="w-full" />
					<template #info>
						至少 3 个字符，不能包含空格。
					</template>
				</PFormItem>
				<PFormItem label="密码">
					<PInput
						v-model:value="inputPassword"
						type="password"
						class="w-full" />
					<template #info>
						至少 8 个字符。
					</template>
				</PFormItem>
				<PFormItem label="邮箱">
					<PInput
						v-model:value="inputEmail"
						placeholder="非必填，但推荐填写。"
						class="w-full" />
					<template #info>
						非必填，有助于提高账号安全性。
					</template>
				</PFormItem>
				<PFormSeperator>
					<div
						class="text-xl text-white font-bold font-mono pt-3 pb-1">
						安全验证
					</div>
					<div class="font-mono text-xs text-white/60 pb-3">
						请输入星球
						<span
							class="text-nowrap bg-prunplanner text-black px-1"
							>{{ activeSecurityOption }}</span
						>
						的名称。在 Prosperous Universe 中使用命令
						<span
							class="text-nowrap bg-prunplanner text-black px-0.5"
							>{{ `PLI ${activeSecurityOption}` }}</span
						>
						打开星球信息，在 "Name" 字段中查看其名称。
					</div>
				</PFormSeperator>
				<PFormItem label="星球名称">
					<PInput v-model:value="inputPlanetName" class="w-full" />
				</PFormItem>
				<PFormItem label="">
					<PButton
						:disabled="!canRegister"
						:loading="isLoading"
						class="mt-3"
						@click="registerUser">
						创建账号
					</PButton>
				</PFormItem>
			</PForm>
		</template>
	</div>
</template>
