<template>
  <main>
    <h1 class="mt-10 text-center text-4xl font-bold tracking-widest text-red-700">Find Client</h1>
    <section class="px-10 pt-12">
      <div class="grid grid-cols-1 gap-5 md:grid-cols-4">
        <h2 class="text-2xl font-bold">Search Client By</h2>
        <label class="flex flex-col">
          <span class="mb-1">Search type</span>
          <select v-model="searchBy" class="rounded-md border-gray-300 shadow-sm">
            <option value="name">Client Name</option>
            <option value="number">Client Number</option>
          </select>
        </label>
        <template v-if="searchBy === 'name'">
          <label class="flex flex-col">
            <span class="mb-1">First name</span>
            <input v-model.trim="firstName" class="rounded-md border-gray-300 shadow-sm" placeholder="Enter first name" @keyup.enter="handleSubmitForm" />
          </label>
          <label class="flex flex-col">
            <span class="mb-1">Last name</span>
            <input v-model.trim="lastName" class="rounded-md border-gray-300 shadow-sm" placeholder="Enter last name" @keyup.enter="handleSubmitForm" />
          </label>
        </template>
        <label v-else class="flex flex-col">
          <span class="mb-1">Phone number</span>
          <input v-model.trim="phoneNumber" class="rounded-md border-gray-300 shadow-sm" placeholder="Enter client phone number" @keyup.enter="handleSubmitForm" />
        </label>
      </div>
      <div class="mt-5 flex justify-end gap-3">
        <button class="rounded border border-red-700 bg-white text-red-700" type="button" @click="loadData">Clear Search</button>
        <button class="rounded bg-red-700 text-white" type="button" :disabled="loading" @click="handleSubmitForm">
          {{ loading ? 'Searching...' : 'Search Client' }}
        </button>
      </div>
    </section>
    <hr class="my-10" />
    <section class="px-10">
      <h2 class="mb-2 text-2xl font-bold">List of Clients</h2>
      <p class="mb-4 italic">Select a row to view client details.</p>
      <DataTable :columns="columns" :rows="clients" :loading="loading" :clickable="true" empty-message="No clients found." @row-click="openClient" />
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import DataTable from '../components/DataTable.vue';
import { getClients, searchClients } from '../api/api';

const router = useRouter();
const toast = useToast();
const clients = ref([]);
const loading = ref(false);
const searchBy = ref('name');
const firstName = ref('');
const lastName = ref('');
const phoneNumber = ref('');
const columns = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'phoneNumber.primary', label: 'Phone Number' },
  { key: 'address.city', label: 'City' }
];

function errorMessage(error) {
  return error?.response?.data?.message || error?.message || 'Request failed.';
}

async function loadData() {
  searchBy.value = 'name';
  firstName.value = '';
  lastName.value = '';
  phoneNumber.value = '';
  loading.value = true;
  try {
    const response = await getClients();
    clients.value = Array.isArray(response) ? response : [];
  } catch (error) {
    toast.error(errorMessage(error));
  } finally {
    loading.value = false;
  }
}

async function handleSubmitForm() {
  if (searchBy.value === 'name' && !firstName.value && !lastName.value) {
    toast.info('Enter a first name or last name to search.');
    return;
  }
  if (searchBy.value === 'number' && !phoneNumber.value) {
    toast.info('Enter a phone number to search.');
    return;
  }
  loading.value = true;
  try {
    const query = searchBy.value === 'name'
      ? { searchBy: 'name', firstName: firstName.value, lastName: lastName.value }
      : { searchBy: 'number', phoneNumber: phoneNumber.value };
    const response = await searchClients(query);
    clients.value = Array.isArray(response) ? response : [];
  } catch (error) {
    toast.error(errorMessage(error));
  } finally {
    loading.value = false;
  }
}

function openClient(client) {
  router.push({ name: 'clientdetails', params: { id: client._id } });
}

onMounted(loadData);
</script>
