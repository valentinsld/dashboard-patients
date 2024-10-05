<script setup>
import { socket } from "@/utils/socket";

const { data } = await useFetch("/api/patients");

const listPatients = ref(data.value.patients);

const columns = [
  // { key: "id", label: "ID" },
  { key: "medicalRecordNumber", label: "Medical Record Number" },
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "heartRate", label: "Heart Rate" },
  { key: "temperature", label: "Temperature" },
  { key: "bloodPressure", label: "Blood Pressure (systolic/diastolic)" },
];

const listPatientsRow = computed(() => {
  return listPatients.value.map((patient) => {
    return {
      id: patient.id,
      medicalRecordNumber: patient.medicalRecordNumber,
      name: `${patient.firstName} ${patient.lastName}`,
      age: patient.age,
      // (heart rate, temperature, blood pressure)
      heartRate: patient.vitals.heartRate.slice().pop(),
      temperature: patient.vitals.temperature.slice().pop(),
      bloodPressure: `${patient.vitals.bloodPressure.slice().pop().systolic}/${
        patient.vitals.bloodPressure.slice().pop().diastolic
      }`,
    };
  });
});

//
// Recherche
//
const search = ref("");
const hasSearched = ref(false);

const searchHandler = async () => {
  const dataSearch = await $fetch(`/api/patients-search?s=${search.value}`)
  hasSearched.value = true
  listPatients.value = dataSearch
}

const resetSearch = () => {
  search.value = ""
  hasSearched.value = false
  listPatients.value = data.value.patients
}

//
// Update data from WebSocket
//
const listSockets = ref([]);
watch(() => listPatients.value, (newListPatients) => {
  if (socket.connected) {
    onUpdatePatients(newListPatients);
  } else {
    socket.on("connect", () => {
      onUpdatePatients(newListPatients);
    });
  }
})

onMounted(() => {
  if (socket.connected) {
    onUpdatePatients(listPatients.value);
  } else {
    socket.on("connect", () => {
      onUpdatePatients(listPatients.value);
    });
  }
});

const socketListener = (data) => {
  // data : {id, vitals: {heartRate, temperature, bloodPressure, oxygenSaturation}}
  const indexPatient = listPatients.value.findIndex((p) => p.id === data.id);

  if (indexPatient !== -1) {
    // for each vitals, we add the new value
    for (const key in data.vitals) {
      if (data.vitals.hasOwnProperty(key)) {
        listPatients.value[indexPatient].vitals[key].push(data.vitals[key]);
      }
    }
  }
};

const onUpdatePatients = patients => {
  // remove all listeners
  listSockets.value.forEach((s) => {
    socket.off(s[0], s[1]);
  });
  listSockets.value = [];

  // add new listeners
  patients.forEach((patient) => {
    const socketEvent = `patient-update-${patient.id}`;
    socket.on(socketEvent, socketListener);

    listSockets.value.push([socketEvent, socketListener]);
  });
}
</script>

<template>
  <div class="list-patients">
    <div class="list-patients__top">
      <h2 class="top__title">Liste des patients</h2>

      <UButton v-if="hasSearched" @click="resetSearch" color="gray"> Réinitialiser </UButton>

      <UButtonGroup size="sm" orientation="horizontal" class="top__search">
        <UInput v-model="search" />
        <UButton @click="searchHandler"> Rechercher </UButton>
      </UButtonGroup>
    </div>
    <UTable :columns="columns" :rows="listPatientsRow">
      <template #medicalRecordNumber-data="{ row }">
        <ULink :to="`/patients/${row.id}`">
          {{ row.medicalRecordNumber }}
        </ULink>
      </template>
      <template #name-data="{ row }">
        <ULink :to="`/patients/${row.id}`">
          {{ row.name }}
        </ULink>
      </template>
    </UTable>
  </div>
</template>

<style lang="scss" scoped>
.list-patients {
  margin-top: 3rem;

  &__top {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .top {
        &__title {
            margin-right: auto;
        }
    }
  }
}
</style>
