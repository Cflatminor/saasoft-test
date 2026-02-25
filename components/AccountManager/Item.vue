<template>
  <div class="accounts__item row mb-2">
    <div class="col-3">
      <UFormField label="Метки">
        <UInput v-model="labelsAsString" @blur="(e) => update(e, 'labels')" class="w-full" />
      </UFormField>
    </div>

    <div class="col-2">
      <UFormField label="Тип записи">
        <USelect v-model="innerItem.type" @change="(e) => update(e, 'type')" :items="getAccountTypes()" class="w-full" />
      </UFormField>
    </div>

    <div :class="!isLDAPAccountType ? 'col-6' : 'col-3'">
      <UFormField label="Логин" required>
        <UInput v-model="login" @blur="(e) => update(e, 'login')" class="w-full" />
      </UFormField>
    </div>

    <div v-if="isLDAPAccountType" class="col-3">
      <UFormField label="Пароль" required>
        <UInput
          v-model="password"
          class="w-full"
          @blur="(e) => update(e, 'password')"
          :type="showPassword ? 'text' : 'password'"
          :ui="{ trailing: 'pe-1' }"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="showPassword"
              aria-controls="password"
              @mousedown.prevent="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>
    </div>

    <div class="col-1 ml-auto d-flex align-items-end justify-center">
      <UButton @click="() => del(item.id)" icon="i-lucide-circle-x" size="md" color="primary" variant="solid" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {type Account, AccountTypeEnum} from "@/src/core/types/account";
import type {Label} from "@/src/core/types/label";

interface Props {
  item: Account,
  update?: () => {},
  delete?: () => {}
}

const props = defineProps<Props>();

const emit = defineEmits(['update', 'delete']);
const innerItem = computed(() => props.item);
const isLDAPAccountType = computed(() => innerItem.value.type === AccountTypeEnum.LDAP);
const showPassword = ref(false);
const labelsAsString = ref("");
const login = ref("");
const password = ref("");

if (innerItem) {
  login.value = innerItem.value.login || "";
  password.value = innerItem.value.password || "";
  formatLabelsAsString();
}

function getAccountTypes() {
  return [{
    label: 'Локальная',
    value: AccountTypeEnum.Local
  }, {
    label: 'LDAP',
    value: AccountTypeEnum.LDAP,
  }];
}

function setLabels(labelsAsString: string) {
  innerItem.value.labels = labelsAsString
      .split(";")
      .filter(labelAsString => labelAsString.trim() !== '')
      .map<Label>(labelAsString => {
        return {text: labelAsString.trim()}
      });
}

function formatLabelsAsString() {
  labelsAsString.value = innerItem.value.labels.length ?
      innerItem.value.labels.map(item => item.text).join('; ') :
      "";
}

function del(id: string) {
  emit('delete', id);
}

function update(e: Event, type: string) {
  switch (type) {
    case 'labels':
      const value = (e.target as HTMLInputElement).value;
      setLabels(value);
      formatLabelsAsString();
      break;

    case 'login':
      innerItem.value.login = login.value;
      break;

    case 'type':
      innerItem.value.type === AccountTypeEnum.Local ?
          innerItem.value.password = null :
          void(0);
      break;

    case 'password':
      innerItem.value.password = password.value;
      break;
  }

  emit('update', innerItem.value);
}
</script>