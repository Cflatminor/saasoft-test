<template>
  <div class="accounts__item row mb-2">
    <div class="col-3">
      <UFormField label="Метки">
        <UInput v-model="labelsAsString" @blur="(e) => update(e, FieldTypesEnum.labels)" color="" class="w-full" />
      </UFormField>
    </div>

    <div class="col-2">
      <UFormField label="Тип записи">
        <USelect v-model="accountType" @change="(e) => update(e, FieldTypesEnum.type)" color="" :items="getAccountTypes()" class="w-full" />
      </UFormField>
    </div>

    <div :class="isLDAPAccountType ? 'col-6' : 'col-3'">
      <UFormField label="Логин" required>
        <UInput
          v-model="login"
          @blur="(e) => update(e, FieldTypesEnum.login)"
          maxlength="100"
          :color="hasError(FieldTypesEnum.login) ? 'error' : ''"
          :highlight="hasError(FieldTypesEnum.login)"
          class="w-full"
        />
      </UFormField>
    </div>

    <div v-if="!isLDAPAccountType" class="col-3">
      <UFormField label="Пароль" required>
        <UInput
          v-model="password"
          class="w-full"
          maxlength="100"
          :color="hasError(FieldTypesEnum.password) ? 'error' : ''"
          :highlight="hasError(FieldTypesEnum.password)"
          @blur="(e) => update(e, FieldTypesEnum.password)"
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
import {type Field, ValidationProvider} from "@/components/ValidationProvider";
import {FieldTypesEnum} from "@/components/ValidationProvider/ValidationAlgorithms";
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
const accountType = ref<AccountTypeEnum>(AccountTypeEnum.Local);
const password = ref<string|null>("");
const validationFieldset = ref<Field[]>([]);

if (innerItem) {
  formatLabelsAsString();
  buildValues()
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

function getValidationFieldSet(): Field[] {
  const passwordField = validationFieldset.value.find(item => item.type === FieldTypesEnum.password);
  let result = [
    {
      type: FieldTypesEnum.login,
      value: login.value,
      hasError: false
    }
  ]

  if (!isLDAPAccountType.value && !passwordField) {
    result.push({
      type: FieldTypesEnum.password,
      value: "",
      hasError: false
    })
  }

  return result;
}

function setLabels(labelsAsString: string) {
  innerItem.value.labels = labelsAsString
      .split(";")
      .filter(labelAsString => labelAsString.trim() !== '')
      .map<Label>(labelAsString => {
        return {text: labelAsString.trim()}
      });
}

function hasError(fieldType: string): boolean {
  return Boolean(validationFieldset.value.find(field => field.type === fieldType)?.hasError)
}

function buildValues() {
  accountType.value = innerItem.value.type || AccountTypeEnum.Local;
  login.value = innerItem.value.login || "";
  password.value = innerItem.value.password || null;
}

function formatLabelsAsString() {
  labelsAsString.value = innerItem.value.labels.length ?
      innerItem.value.labels.map(item => item.text).join('; ') :
      "";
}

function del(id: string) {
  emit('delete', id);
}

function updateFieldset(type: string, value: any) {
  const field = validationFieldset.value.find(f => f.type === type)
  if (field) {
    field.value = value
    field.hasError = false
  } else {
    validationFieldset.value.push({
      type,
      value,
      hasError: false
    })
  }
}

function update(e: Event, type: string) {
  switch (type) {
    case FieldTypesEnum.labels:
      const val = (e.target as HTMLInputElement).value;
      setLabels(val);
      formatLabelsAsString();
      updateFieldset(FieldTypesEnum.labels, val);
      break;

    case FieldTypesEnum.login:
      innerItem.value.login = login.value;
      updateFieldset(FieldTypesEnum.login, login.value);
      break;

    case FieldTypesEnum.password:
      innerItem.value.password = password.value;
      updateFieldset(FieldTypesEnum.password, password.value);
      break;

    case FieldTypesEnum.type:
      innerItem.value.type = accountType.value;
      if (isLDAPAccountType.value) {
        innerItem.value.password = null
      } else {
        innerItem.value.password = ""
      }
      updateFieldset(FieldTypesEnum.type, accountType.value)
      break;
  }

  ValidationProvider
      .validate(validationFieldset.value)
      .then((fieldset) => {
        validationFieldset.value = fieldset;
        emit('update', innerItem.value);
      })
      .catch((fieldset) => {
        validationFieldset.value = fieldset;
      })
}
</script>