<script setup>
const props = defineProps({
  id: Number,
  firstName: String,
  lastName: String,
  age: Number,
  medicalRecordNumber: String,
});

const firstName = ref(props.firstName);
const lastName = ref(props.lastName);
const age = ref(props.age);

const loading = ref(false);
const updatePatient = async () => {
  loading.value = true;

  try {
    // try fake loading 5s
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const d = await $fetch(`/api/patients/${props.id}`, {
      method: "POST",
      body: {
        firstName: firstName.value,
        lastName: lastName.value,
        age: age.value,
      },
    });
    loading.value = false;

    if (d.error) {
      throw createError({
        statusCode: 400,
        message: d.error,
      });
    }

    firstName.value = d.firstName;
    lastName.value = d.lastName;
    age.value = d.age;
  } catch (e) {
    loading.value = false;
    throw createError({
      statusCode: 500,
      message: "Impossible de mettre à jour le patient",
    });
  }
};
</script>

<template>
  <UCard class="patient-card">
    <Loader :is-loading="loading" />

    <h2>Patient : {{ medicalRecordNumber }}</h2>
    <br />

    <UFormGroup label="Prenom :" name="firstName">
      <UInput v-model="firstName" type="text" />
    </UFormGroup>

    <UFormGroup label="Nom :" name="lastName">
      <UInput v-model="lastName" type="text" />
    </UFormGroup>

    <UFormGroup label="Age :" name="age">
      <UInput v-model="age" type="number" />
    </UFormGroup>

    <br />
    <UButton @click="updatePatient" color="primary">Mettre à jour</UButton>
  </UCard>
</template>

<style lang="scss" scoped>
.patient-card {
  position: relative;
  overflow: hidden;
}
</style>
