<template>
  <div class="overflow-x-auto">
    <p v-if="loading" class="py-4 text-center text-gray-500" role="status">
      Loading...
    </p>
    <p v-else-if="!rows.length" class="py-4 text-center text-gray-500">
      {{ emptyMessage }}
    </p>
    <table v-else class="min-w-full rounded shadow-md">
      <thead class="bg-gray-50 text-left text-lg">
        <tr>
          <th v-for="column in columns" :key="column.key" class="p-3" scope="col">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-300">
        <tr
          v-for="(row, index) in rows"
          :key="row[rowKey] ?? index"
          class="transition-colors"
          :class="{ 'cursor-pointer hover:bg-red-50': clickable }"
          :tabindex="clickable ? 0 : undefined"
          @click="handleRowClick(row)"
          @keydown.enter="handleRowClick(row)"
          @keydown.space.prevent="handleRowClick(row)"
        >
          <td v-for="column in columns" :key="column.key" class="p-3">
            {{ displayValue(row, column.key) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    default: () => []
  },
  rowKey: {
    type: String,
    default: '_id'
  },
  loading: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'No records found.'
  }
});

const emit = defineEmits(['row-click']);

function displayValue(row, key) {
  const value = key.split('.').reduce((current, part) => current?.[part], row);
  return value === null || value === undefined || value === '' ? '—' : value;
}

function handleRowClick(row) {
  if (props.clickable) {
    emit('row-click', row);
  }
}
</script>
