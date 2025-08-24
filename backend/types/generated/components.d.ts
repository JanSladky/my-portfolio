import type { Schema, Struct } from '@strapi/strapi';

export interface HomeBullet extends Struct.ComponentSchema {
  collectionName: 'components_home_bullets';
  info: {
    displayName: 'Bullet';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeServiceCard extends Struct.ComponentSchema {
  collectionName: 'components_home_service_cards';
  info: {
    displayName: 'ServiceCard';
  };
  attributes: {
    bullets: Schema.Attribute.Component<'home.bullet', true>;
    icon: Schema.Attribute.Enumeration<['file', 'sitemap', 'wpforms', 'edit']>;
    title: Schema.Attribute.String;
  };
}

export interface HomeStepCard extends Struct.ComponentSchema {
  collectionName: 'components_home_step_cards';
  info: {
    displayName: 'StepCard';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<
      ['handshake', 'ruler', 'comments', 'bug', 'plane']
    >;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'home.bullet': HomeBullet;
      'home.service-card': HomeServiceCard;
      'home.step-card': HomeStepCard;
    }
  }
}
