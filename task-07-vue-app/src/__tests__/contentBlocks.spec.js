import {
  describe,
  expect,
  it
} from "vitest";
import {
  mount,
  RouterLinkStub
} from "@vue/test-utils";

import HeroBlock from "../components/blocks/HeroBlock.vue";
import TextBlock from "../components/blocks/TextBlock.vue";
import FeaturesBlock from "../components/blocks/FeaturesBlock.vue";
import CallToActionBlock from "../components/blocks/CallToActionBlock.vue";
import UnsupportedBlock from "../components/blocks/UnsupportedBlock.vue";

describe("dynamic content blocks", () => {
  it("renders hero, text, and feature block content", () => {
    const hero = mount(HeroBlock, {
      props: {
        data: {
          heading: "Dynamic Hero",
          subheading: "Reusable hero content."
        }
      }
    });

    const text = mount(TextBlock, {
      props: {
        data: {
          heading: "About",
          body: "Reusable text content."
        }
      }
    });

    const features = mount(FeaturesBlock, {
      props: {
        data: {
          heading: "Features",
          items: [
            {
              title: "Reusable",
              description:
                "Built as a reusable component."
            }
          ]
        }
      }
    });

    expect(hero.text()).toContain(
      "Dynamic Hero"
    );
    expect(hero.text()).toContain(
      "Reusable hero content."
    );

    expect(text.text()).toContain(
      "Reusable text content."
    );

    expect(features.text()).toContain(
      "Reusable"
    );
    expect(features.text()).toContain(
      "Built as a reusable component."
    );
  });

  it("renders call-to-action and unsupported fallback content", () => {
    const cta = mount(
      CallToActionBlock,
      {
        props: {
          data: {
            heading: "Get Started",
            text: "Contact our team.",
            button_label: "Contact Us",
            button_url: "/contact"
          }
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      }
    );

    const unsupported = mount(
      UnsupportedBlock,
      {
        props: {
          type: "gallery"
        }
      }
    );

    expect(cta.text()).toContain(
      "Get Started"
    );
    expect(cta.text()).toContain(
      "Contact Us"
    );

    expect(unsupported.text()).toContain(
      "This content section is currently unavailable."
    );
    expect(unsupported.text()).toContain(
      "gallery"
    );
  });
});