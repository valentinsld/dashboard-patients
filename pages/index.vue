<script setup>
const router = useRouter();

definePageMeta({
  layout: "login",
});

const state = reactive({
  email: undefined,
  password: undefined,
});

const validate = (state) => {
  const errors = [];
  if (!state.email) errors.push({ path: "email", message: "Required" });
  if (!state.password) errors.push({ path: "password", message: "Required" });
  return errors;
};

async function onSubmit(event) {
  router.push("/patients");
}
</script>

<template>
  <div class="main-login">
    <UCard class="main-login__content">
      <Logo class="content__logo" />

      <UForm
        class="content__form space-y-4"
        :state="state"
        :validate="validate"
        @submit="onSubmit"
      >
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <div class="form__bottom">
          <ULink> Mot de passe oublié ? </ULink>
          <UButton type="submit"> Envoyer </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<style scoped lang="scss">
.main-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  widows: 100%;

  &__content {
    width: 100%;
    max-width: 400px;

    .content {
      &__logo {
        text-align: center;
        margin-bottom: 0.5rem;
      }

      &__form {
        .form {
          &__bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
