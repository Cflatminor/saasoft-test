<template>
  <div class="account-manager p-4 accounts">
    <div class="container">
      <div class="row mb-2">
        <div class="col-12">
          <div class="flex align-items-center">
            <span class="mr-2">Учётные записи:</span>
            <UButton @click="create" icon="i-lucide-plus" size="md" color="primary" variant="solid" />
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-12">
          <UAlert
            title="Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;"
            icon="i-lucide-info"
            color="warning"
            :ui="{
              root: 'w-full rounded-md p-2 items-center',
              icon: 'size-7'
            }"
          />
        </div>
      </div>

      <div class="accounts__items">
        <Item
          v-for="item in accounts"
          :key="item.id"
          :item="item"
          @update="update"
          @delete="del"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Item from "./Item.vue";

import type { Account } from "@/src/core/types/account";

interface Props {
  accounts: Account[],
  create?: () => {},
  update?: () => {},
  delete?: () => {}
}

defineProps<Props>();

const emit = defineEmits(['create', 'update', 'delete']);

function create() {
  emit('create');
}

function update(account: Account) {
  emit('update', account);
}

function del(id: string) {
  emit('delete', id);
}
</script>