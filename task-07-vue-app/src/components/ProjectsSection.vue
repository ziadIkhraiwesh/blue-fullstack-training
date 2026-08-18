<script setup>
import { computed, ref } from "vue";
import ProjectFilter from "./ProjectFilter.vue";
import ProjectCard from "./ProjectCard.vue";

const categories = [
  { value: "all", label: "All" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "ui-ux", label: "UI/UX" }
];

const projects = [
  {
    id: 1,
    title: "Business Analytics Dashboard",
    category: "web",
    categoryLabel: "Web",
    description:
      "A responsive dashboard for monitoring business performance and operational data.",
    technology: "Vue.js",
    year: 2026
  },
  {
    id: 2,
    title: "Online Booking Platform",
    category: "web",
    categoryLabel: "Web",
    description:
      "A clear booking experience for managing appointments and service availability.",
    technology: "JavaScript",
    year: 2026
  },
  {
    id: 3,
    title: "E-Commerce Management Portal",
    category: "web",
    categoryLabel: "Web",
    description:
      "A practical interface for managing products, orders, customers, and inventory.",
    technology: "Vue 3",
    year: 2026
  },
  {
    id: 4,
    title: "Smart Study Assistant",
    category: "mobile",
    categoryLabel: "Mobile",
    description:
      "A mobile solution for organizing subjects, assignments, and upcoming exams.",
    technology: "Flutter",
    year: 2026
  },
  {
    id: 5,
    title: "Inventory Mobile App",
    category: "mobile",
    categoryLabel: "Mobile",
    description:
      "A mobile application for reviewing stock quantities and inventory updates.",
    technology: "Mobile UI",
    year: 2026
  },
  {
    id: 6,
    title: "Healthcare Portal Design",
    category: "ui-ux",
    categoryLabel: "UI/UX",
    description:
      "An accessible interface concept for appointments and patient services.",
    technology: "UI Design",
    year: 2026
  },
  {
    id: 7,
    title: "E-Commerce User Experience",
    category: "ui-ux",
    categoryLabel: "UI/UX",
    description:
      "A shopping experience focused on product discovery and simple checkout.",
    technology: "UX Research",
    year: 2026
  },
  {
    id: 8,
    title: "Financial Services Prototype",
    category: "ui-ux",
    categoryLabel: "UI/UX",
    description:
      "A user-friendly prototype for viewing accounts and financial activity.",
    technology: "Prototyping",
    year: 2026
  }
];

const selectedCategory = ref("all");
const selectedProject = ref(null);

const filteredProjects = computed(() => {
  if (selectedCategory.value === "all") {
    return projects;
  }

  return projects.filter(
    (project) => project.category === selectedCategory.value
  );
});

const handleFilterChange = (category) => {
  selectedCategory.value = category;
  selectedProject.value = null;
};

const handleViewDetails = (project) => {
  selectedProject.value = project;
};
</script>

<template>
  <section id="projects" class="section projects-section">
    <div class="container">
      <p class="eyebrow-text">Reactive Vue Components</p>
      <h2>Featured Projects</h2>

      <p class="section-description">
        These cards are rendered with v-for and filtered reactively using
        ref() and computed().
      </p>

      <ProjectFilter
        :categories="categories"
        :selected-category="selectedCategory"
        @filter-change="handleFilterChange"
      />

      <p class="result-count" aria-live="polite">
        Showing {{ filteredProjects.length }} projects.
      </p>

      <div v-if="selectedProject" class="selected-project" aria-live="polite">
        <div>
          <strong>Selected project: {{ selectedProject.title }}</strong>
          <p>
            {{ selectedProject.categoryLabel }} —
            {{ selectedProject.technology }}
          </p>
        </div>

        <button
          type="button"
          aria-label="Close selected project details"
          @click="selectedProject = null"
        >
          Close
        </button>
      </div>

      <div class="projects-grid">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          @view-details="handleViewDetails"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects-section {
  background-color: var(--color-surface);
}

h2 {
  margin-bottom: 1rem;
  color: var(--color-primary);
  font-size: clamp(2rem, 4vw, 3rem);
}

.section-description {
  max-width: 700px;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.result-count {
  margin-bottom: 1.25rem;
  color: var(--color-text-muted);
  font-weight: 700;
}

.selected-project {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  color: var(--color-primary);
  background-color: #eaf6fb;
  border: 1px solid #b9ddea;
  border-radius: 0.75rem;
}

.selected-project p {
  margin-top: 0.25rem;
  color: var(--color-text-muted);
}

.selected-project button {
  min-height: 42px;
  padding: 0.55rem 0.9rem;
  color: var(--color-primary);
  font-weight: 800;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
  cursor: pointer;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .selected-project {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>