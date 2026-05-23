<script setup lang="ts">
import { BaseLoader, RaffleCard, PageContainer } from '@/shared/components/ui';
import { useFetchActiveRaffles } from '../composables/use-fetch-active-raffles';
import HomeFilter from '../components/HomeFilter.vue';
import HomeHero from '../components/HomeHero.vue';
import HomeEmptyState from '../components/HomeEmptyState.vue';
import HomeErrorState from '../components/HomeErrorState.vue';
import HowToParticipate from '../components/HowToParticipate.vue';

const { raffles, isLoading, error, filter, totalAvailable } = useFetchActiveRaffles();

const handleRetry = () => {
  window.location.reload();
};
</script>

<template>
  <div>
    <HomeHero
      v-if="raffles"
      :raffles="raffles"
      :total-available="totalAvailable"
    />

    <section v-if="raffles" class="py-6 bg-dark-surface">
      <PageContainer>
        <HomeFilter
          v-model="filter"
          :total-raffles="raffles.length"
        />
      </PageContainer>
    </section>

    <section class="py-12">
      <PageContainer>
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <BaseLoader size="lg" />
        </div>

        <HomeErrorState v-else-if="error" @retry="handleRetry" />

        <HomeEmptyState v-else-if="raffles && raffles.length === 0" :filter="filter" />

        <div v-else-if="raffles" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RaffleCard
            v-for="raffle in raffles"
            :key="raffle.id"
            :raffle="raffle"
          />
        </div>
      </PageContainer>
    </section>

    <HowToParticipate />
  </div>
</template>
