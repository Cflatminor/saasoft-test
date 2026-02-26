<template>
  <div class="home-page">
    <div v-if="isGettingInitialData" class="container">
      <div class="row justify-center">
        <div class="col-4">
          <UProgress animation="swing" />
        </div>
      </div>
    </div>

    <AccountManager
      v-else
      :class="[{'loading': isUpdating}]"
      :accounts="accounts"
      @create="createAccount"
      @delete="deleteAccount"
      @update="updateAccount"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * В идеале обработкой событий и организацией исходных данных занимается презентер, не привязанный
 * к ui фреймворку, и предоставляет весь необходимый интерфейс представлению. При необходимости в
 * сложных приложениях может быть реализован детальный рефакторинг с распределением ответственности
 * между паттернами и слоями, код становится чище и понятнее, файлы на 1000 строк преобразуются в
 * человеко-читаемую структуру. Сейчас в этом нет необходимости.
 */

import useAccountsStore from "@/stores/accounts";
import AccountsService from "@/src/core/services/accounts";
import type {Account} from "@/src/core/types/account";

const accountsStore = useAccountsStore();
const isGettingInitialData = ref(true);
const isUpdating = ref(false);
const error = ref<string>("");
const accounts = ref<Account[]>();

async function createAccount() {
  isUpdating.value = true;

  try {
    await AccountsService.createAccount().then(async (response) => {
      if (accounts.value) {
        accounts.value.push(response);
        await accountsStore.setAccounts(accounts.value);
      }
    })
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isUpdating.value = false;
  }
}

async function deleteAccount(id: string) {
  isUpdating.value = true;

  try {
    await AccountsService.deleteAccount(id).then(async (deletedId) => {
      if (accounts.value) {
        accounts.value = accounts.value.filter(item => item.id !== deletedId);
        await accountsStore.setAccounts(accounts.value);
      }
    })
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isUpdating.value = false;
  }
}

async function updateAccount(account: Account) {
  isUpdating.value = true;

  try {
    await AccountsService.updateAccount(account).then(async (updatedAccount) => {
      if (accounts.value) {
        accounts.value = accounts.value.map(item =>
          item.id === updatedAccount.id ? updatedAccount : item
        );
        await accountsStore.setAccounts(accounts.value);
      }
    })
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isUpdating.value = false;
  }
}

onMounted(async () => {
  /**
   * логично предположить, что данные в реальном приложениискорее всего будут браться не с локал
   * стораджа и не из сессии.
   * во-первых всяческие фрагментации,битые сектора, сбои прошивки, и прочие теоретически возможные неисправности
   * дисков, если они не в raid-массиве. Во-вторых, скорее всего приложение будет необходимо
   * использовать с различных устройств и иметь доступ к актуальным данным.
   *
   * Так же, важно учитывать, что объём этих хранилищ сильно ограничен, а в случае с большими,
   * но не превышающими лимит, массивами данных - негативно скажется на производительности.
   * Поэтому, мы будем делить на части по пагинации, что в принципе делает
   * использование глобального стора неуместным. Однако, по ТЗ мы используем pinia и сохраняем стейт в
   * сессию или на жёсктий диск, так мы можем быстрее работать с данными в пределах сессии на одном устройстве,
   * не дёргая апи при каждом спа переходе или жёсткой перезагрузке.
   *
   * В реальном приложении нужно учесть вероятность работы параллельно нескольких юзеров и их синхронизацию.
   * Это потребует более детальной проработки, однако yagni - на реальном проекте мы это обсудим.
   * Сейчас - тестовое по ТЗ, с возможностью необходимых доработок по необходимости
   */

  try {
    if (accountsStore.getAccounts.length) {
      accounts.value = accountsStore.getAccounts;
    } else {
      await AccountsService.getAccounts().then(async (response) => {
        await accountsStore.setAccounts(response);
        accounts.value = response;
      })
    }
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isGettingInitialData.value = false;
  }
})
</script>

<style lang="scss" src="./main.scss" />