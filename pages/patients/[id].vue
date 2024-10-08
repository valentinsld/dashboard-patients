<script setup>
import { socket } from "@/utils/socket";
const id = useRoute().params.id;

const { data } = await useFetch(`/api/patients/${id}`);

const patient = ref(data.value);

//
// Update data from client
// 

onMounted(() => {
  if (socket.connected) {
    onUpdatePatient();
  } else {
    socket.on("connect", () => {
      onUpdatePatient();
    });
  }
});

const updateVitals = (data) => {
  for (const key in data.vitals) {
    if (data.vitals.hasOwnProperty(key)) {
      patient.value.vitals[key].push(data.vitals[key]);
    }
  }
};

const onUpdatePatient = () => {
  socket.on(`patient-update-${patient.value.id}`, updateVitals);
};

onUnmounted(() => {
  socket.off(`patient-update-${patient.value.id}`, updateVitals);
});

//
// const datas graphs
//
const datasetHeartRate = computed(() => {
  return [
    {
      label: "Heart Rate",
      data: [...patient.value.vitals.heartRate],
      borderColor: "red",
    },
  ];
});
const datasetTemperature = computed(() => {
  return [
    {
      label: "Temperature",
      data: [...patient.value.vitals.temperature],
      borderColor: "green",
    },
  ];
});

const datasetOxygenSaturation = computed(() => {
  return [
    {
      label: "Oxygen Saturation",
      data: [...patient.value.vitals.oxygenSaturation],
      borderColor: "blue",
    },
  ];
});

const datasetBloodPressure = computed(() => {
  const systolic = [];
  const diastolic = [];

  if (patient.value.vitals.bloodPressure) {
    patient.value.vitals.bloodPressure.forEach((bp) => {
      systolic.push(bp.systolic);
      diastolic.push(bp.diastolic);
    });
  }

  return [
    {
      label: "Systolic",
      data: systolic,
      borderColor: "purple",
    },
    {
      label: "Diastolic",
      data: diastolic,
      borderColor: "blue",
    },
  ];
});
</script>

<template>
  <div class="patient-single">
    <!-- back button -->
    <div class="patient-single__back">
      <ULink to="/patients">
        Retour à la liste des patients
      </ULink>
    </div>

    <div class="patient-single__content">
      <PatientCard
        v-if="patient"
        :id="patient.id"
        :firstName="patient.firstName"
        :lastName="patient.lastName"
        :age="patient.age"
        :medicalRecordNumber="patient.medicalRecordNumber"
        class="content__infos"
      />

      <div class="content__graphs">
        <PatientGraph
          v-if="patient.vitals.heartRate"
          :datas="datasetHeartRate"
        />
        <PatientGraph
          v-if="patient.vitals.temperature"
          :datas="datasetTemperature"
        />
        <PatientGraph
          v-if="patient.vitals.oxygenSaturation"
          :datas="datasetOxygenSaturation"
        />
        <PatientGraph
          v-if="patient.vitals.bloodPressure"
          :datas="datasetBloodPressure"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.patient-single {
  &__back {
    margin-bottom: 1rem;
  }

  &__content {
    @media (min-width: 768px) {
      display: flex;
      align-items: flex-start;
      gap: 2rem;
  
      .content {
        &__infos {
          flex: 1;
        }
    
        &__graphs {
          flex: 2;
    
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      }
    }
  }
}
</style>
