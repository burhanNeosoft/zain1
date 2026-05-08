import React from 'react';
import Image from 'next/image';
import styles from './WhyBuyOnline.module.scss';
import BuyOnline  from '../../public/banner.jpeg';
import GroupIcon from '../../public/zain.jpeg'

const imgWhyShouldBuyOnlineImg = BuyOnline;
const imgGroup = GroupIcon;
const imgGroup1 = GroupIcon
const imgGroup2 = GroupIcon
const imgGroup3 = GroupIcon
const imgGroup4 = GroupIcon

interface FeatureItemProps {
  icon: any;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <div className={styles.featureItem}>
    <div className={styles.iconContainer}>
      <Image
        src={icon}
        alt={title}
        className={styles.icon}
        width={36}
        height={36}
      />
    </div>
    <div className={styles.featureContent}>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  </div>
);

const WhyBuyOnline: React.FC = () => {
  const features = [
    {
      icon: imgGroup,
      title: 'Multiple Payments Methods',
      description: 'Different payment methods, SADAD, Mada Cards, Credit Cards or Installments',
    },
    {
      icon: imgGroup1,
      title: 'Medical condition pricing',
      description: 'Instant pricing for most of medical cases, no medical reports required.',
    },
    {
      icon: imgGroup2,
      title: 'Live Provider Search',
      description: 'Access to all providers, comprehensive search for providers on every scheme',
    },
    {
      icon: imgGroup3,
      title: 'Instant Policy Activation',
      description: 'Immediate policy link with health insurance council upon payment collection',
    },
    {
      icon: imgGroup4,
      title: 'Fully Digital & Zero Documents',
      description: 'Digital experience, no manual filling, zero stamp and signature experience',
    },
    {
      icon: imgGroup,
      title: 'All Time Digital Support',
      description: 'Customer support team to guide and answer all inquires and resolve issues',
    },
  ];

  return (
    <section className={styles.whyBuyContainer} data-node-id="4498:97735">
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Why you should buy online</h2>
          <p className={styles.subtitle}>
            A faster and simpler digital way to buy medical insurance for your business.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className={styles.ctaSection}>
          <p className={styles.ctaText}>If you want to see more detail about Bupa Munshaat</p>
          <button className={styles.ctaButton}>Click Here</button>
        </div>
      </div>

      <div className={styles.imageContainer}>
        <Image
          src={imgWhyShouldBuyOnlineImg}
          alt="Why should buy online"
          className={styles.heroImage}
          width={420}
          height={675}
        />
      </div>
    </section>
  );
};

export default WhyBuyOnline;
