<template>
  <div class="page-wrapper">
    <h1 class="home-page-title">{{ appTitle }}</h1>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  head() {
    return {
      title: {
        inner: 'Home',
      },
      meta: [
        {
          name: 'description',
          content: `${this.appTitle} home page`,
          id: 'desc',
        },
      ],
    };
  },
  computed: mapState('app', ['appTitle']),
};
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.page-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .logo {
    margin-bottom: 3rem;
  }

  .home-page-title {
    text-align: center;
  }

  .documentation-link {
    background-color: #5d6788;
    border-radius: 4px;
    box-sizing: border-box;
    color: #fff;
    display: inline-block;
    font-size: 1.2rem;
    font-weight: 500;
    padding: 0.8rem 1.6rem;
    text-decoration: none;
    transition: background-color 0.1s ease;
    width: fit-content;
  }
}
</style>
