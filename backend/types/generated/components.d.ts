import type { Schema, Struct } from '@strapi/strapi';

export interface CvCvWorkItem extends Struct.ComponentSchema {
  collectionName: 'components_cv_cv_work_items';
  info: {
    displayName: 'CvWorkItem';
  };
  attributes: {
    company: Schema.Attribute.String;
    date: Schema.Attribute.String;
    description: Schema.Attribute.String;
    position: Schema.Attribute.String;
  };
}

export interface CvEducationItem extends Struct.ComponentSchema {
  collectionName: 'components_cv_education_items';
  info: {
    displayName: 'EducationItem';
  };
  attributes: {
    edu_date: Schema.Attribute.String;
    edu_description: Schema.Attribute.Text;
    edu_school: Schema.Attribute.String;
  };
}

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
      'cv.cv-work-item': CvCvWorkItem;
      'cv.education-item': CvEducationItem;
      'home.bullet': HomeBullet;
      'home.service-card': HomeServiceCard;
      'home.step-card': HomeStepCard;
    }
  }
}
