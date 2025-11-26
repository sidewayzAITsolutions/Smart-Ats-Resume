import React, { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';

const heroBadges = [
  { icon: 'shield', label: '98.4% ATS pass rate' },
  { icon: 'clock', label: 'Build in under 10 min' },
  { icon: 'zap', label: 'AI bullet points' },
];

const trustSignals = [
  { icon: 'trending-up', value: '60%', label: 'Faster hiring' },
  { icon: 'award', value: '94%', label: 'Recruiters rely on ATS' },
  { icon: 'check-circle', value: '75%', label: 'Resumes auto-rejected' },
];

const atsMetrics = [
  { label: 'Keyword Match', value: '92%' },
  { label: 'Format Score', value: '96%' },
  { label: 'Readability', value: '94%' },
];

const whySmartATS = [
  {
    title: 'Advanced ATS Scorecard',
    description:
      'Real-time scoring that mirrors Fortune 500 systems with keyword density analysis and formatting audits.',
    bullets: [
      'Live pass/fail feedback',
      'Section-by-section insights',
      'Industry-specific rulesets',
      'Export-ready recommendations',
    ],
    icon: 'bar-chart-2',
  },
  {
    title: 'AI Content Genius',
    description:
      'Generate quantified bullet points, STAR stories, and recruiter-ready summaries in seconds.',
    bullets: [
      'Role-aware tone',
      'Achievement quantification',
      'Auto keyword infusion',
      'Voice consistency',
    ],
    icon: 'cpu',
  },
];

const mobilePerks = [
  {
    title: 'Pocket Builder',
    description:
      'Create and edit resumes anywhere. Offline drafts sync automatically once you regain service.',
    icon: 'smartphone',
  },
  {
    title: 'Job Drop',
    description:
      'Share a job post from any app and SmartATS extracts role keywords into your resume instantly.',
    icon: 'share-2',
  },
  {
    title: 'Push Intelligence',
    description:
      'Opt into weekly haptic nudges when a job perfectly matches your profile or when it is time to update.',
    icon: 'bell',
  },
];

const templateSlides = [
  {
    id: 'executive',
    title: 'Executive Precision',
    image: require('./assets/2.png'),
    tags: ['C-Level', 'ATS Safe'],
  },
  {
    id: 'creative',
    title: 'Creative Voltage',
    image: require('./assets/4.png'),
    tags: ['Design', 'Portfolio ready'],
  },
  {
    id: 'sales',
    title: 'Revenue Driver',
    image: require('./assets/new1.png'),
    tags: ['Sales', 'Metric heavy'],
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Free',
    cadence: 'Forever',
    highlighted: false,
    features: [
      '1 ATS resume',
      'Basic templates',
      'Email support',
      'PDF exports',
    ],
  },
  {
    name: 'Pro',
    price: '$22',
    cadence: 'Monthly',
    highlighted: true,
    features: [
      'Unlimited resumes',
      'Premium templates',
      'AI generation',
      'Priority support',
      'Cancel anytime',
    ],
  },
  {
    name: 'Elite',
    price: '$200',
    cadence: 'Yearly',
    highlighted: false,
    features: [
      'Save $64 yearly',
      'Advanced analytics',
      'Custom branding',
      'Dedicated coach calls',
    ],
  },
];

const comparisonRows = [
  {
    feature: 'Real-time ATS scoring',
    smart: 'Included',
    others: 'Delayed or paywalled',
  },
  {
    feature: 'All templates ATS-optimized',
    smart: '8+ battle-tested',
    others: '4 templates at most',
  },
  {
    feature: 'Keyword optimizer',
    smart: 'AI-led + job parser',
    others: 'Manual inputs',
  },
  {
    feature: 'Free downloads',
    smart: '3 PDF exports',
    others: 'TXT only / locked',
  },
  {
    feature: 'No hidden fees',
    smart: 'Simple, transparent',
    others: 'Auto-renew traps',
  },
];

const footerLinks = [
  { label: 'Pricing', url: 'https://smartatsresume.com/pricing' },
  { label: 'ATS Guide', url: 'https://smartatsresume.com/ats-guide' },
  { label: 'Templates', url: 'https://smartatsresume.com/templates' },
  { label: 'Support', url: 'https://smartatsresume.com/contact' },
];

const { width } = Dimensions.get('window');

export default function App() {
  const handleLink = useCallback((url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url).catch(() => {});
  }, []);

  return (
    <LinearGradient
      colors={['#050505', '#090909', '#050505']}
      style={styles.gradient}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <Image
              source={require('./assets/horse-logo.png')}
              style={styles.logo}
            />
            <Text style={styles.eyebrow}>SmartATS Mobile</Text>
            <Text style={styles.heroTitle}>
              Beat the bots. Land interviews anywhere.
            </Text>
            <Text style={styles.heroSubtitle}>
              The AI resume studio you love — now rebuilt for thumb-friendly,
              on-the-go flow with the same rich visuals and ATS dominance.
            </Text>

            <View style={styles.badgeRow}>
              {heroBadges.map((badge) => (
                <View key={badge.label} style={styles.badge}>
                  <Feather name={badge.icon} size={16} color="#34d399" />
                  <Text style={styles.badgeText}>{badge.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.ctaRow}>
              <CTAButton
                label="Start Building"
                icon="arrow-right"
                onPress={() => handleLink('https://smartatsresume.com/login')}
              />
              <CTAButton
                label="Contact Sales"
                icon="headphones"
                variant="secondary"
                onPress={() =>
                  handleLink('https://smartatsresume.com/contact-sales')
                }
              />
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Trusted Proof</Text>
            <View style={styles.trustGrid}>
              {trustSignals.map((signal) => (
                <View key={signal.label} style={styles.trustItem}>
                  <Feather name={signal.icon} size={22} color="#f59e0b" />
                  <Text style={styles.trustValue}>{signal.value}</Text>
                  <Text style={styles.trustLabel}>{signal.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <BlurView intensity={40} tint="dark" style={styles.atsCard}>
            <Text style={styles.sectionEyebrow}>Live ATS Demo</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>ATS Score</Text>
              <Text style={styles.scoreValue}>94</Text>
            </View>
            <View style={styles.metricsColumn}>
              {atsMetrics.map((metric) => (
                <View key={metric.label} style={styles.metricRow}>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <View style={styles.metricBarBackground}>
                    <View
                      style={[
                        styles.metricBarFill,
                        { width: metric.value },
                      ]}
                    />
                  </View>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                </View>
              ))}
            </View>
            <View style={styles.optimizedPill}>
              <Feather name="check-circle" size={18} color="#34d399" />
              <Text style={styles.optimizedText}>
                Resume is optimized — send with confidence.
              </Text>
            </View>
          </BlurView>

          <SectionHeader
            eyebrow="Mobile-first perks"
            title="Made for busy pros"
            subtitle="Powerful gestures, haptics, and offline superpowers."
          />
          <View style={styles.perkGrid}>
            {mobilePerks.map((perk) => (
              <View key={perk.title} style={styles.perkCard}>
                <Feather name={perk.icon} size={22} color="#f97316" />
                <Text style={styles.perkTitle}>{perk.title}</Text>
                <Text style={styles.perkDescription}>{perk.description}</Text>
              </View>
            ))}
          </View>

          <SectionHeader
            eyebrow="Templates"
            title="Swipe through elite layouts"
            subtitle="Every template is ATS-compliant and retina-ready."
          />
          <FlatList
            horizontal
            data={templateSlides}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.templateList}
            nestedScrollEnabled
            renderItem={({ item }) => (
              <View style={[styles.templateCard, { width: width * 0.7 }]}>
                <Image source={item.image} style={styles.templateImage} />
                <View style={styles.templateContent}>
                  <Text style={styles.templateTitle}>{item.title}</Text>
                  <View style={styles.tagRow}>
                    {item.tags.map((tag) => (
                      <View key={tag} style={styles.tagChip}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}
          />

          <SectionHeader
            eyebrow="Why SmartATS"
            title="Superior intelligence"
            subtitle="Two flagship engines powering record interview rates."
          />
          {whySmartATS.map((feature) => (
            <View key={feature.title} style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <View style={styles.featureIcon}>
                  <Feather name={feature.icon} size={20} color="#fcd34d" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
              </View>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
              {feature.bullets.map((bullet) => (
                <View key={bullet} style={styles.featureBullet}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.featureBulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          ))}

          <SectionHeader
            eyebrow="Value snapshot"
            title="SmartATS vs everyone"
            subtitle="Side-by-side clarity before you subscribe."
          />
          <View style={styles.comparisonCard}>
            {comparisonRows.map((row) => (
              <View key={row.feature} style={styles.comparisonRow}>
                <Text style={styles.comparisonFeature}>{row.feature}</Text>
                <View style={styles.comparisonBadgeSmart}>
                  <Text style={styles.comparisonBadgeText}>{row.smart}</Text>
                </View>
                <View style={styles.comparisonBadgeOther}>
                  <Text style={styles.comparisonBadgeOtherText}>
                    {row.others}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <SectionHeader
            eyebrow="Pricing"
            title="Flexible plans that scale with you"
            subtitle="Transparent pricing, no renewal traps."
          />
          <View style={styles.pricingGrid}>
            {pricingPlans.map((plan) => (
              <View
                key={plan.name}
                style={[
                  styles.pricingCard,
                  plan.highlighted && styles.pricingCardHighlight,
                ]}
              >
                <Text style={styles.pricingName}>{plan.name}</Text>
                <Text style={styles.pricingValue}>{plan.price}</Text>
                <Text style={styles.pricingCadence}>{plan.cadence}</Text>
                {plan.highlighted && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>Most Popular</Text>
                  </View>
                )}
                {plan.features.map((feature) => (
                  <View key={feature} style={styles.planFeature}>
                    <Feather name="check-circle" size={16} color="#34d399" />
                    <Text style={styles.planFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          <LinearGradient
            colors={['#ea580c', '#f97316']}
            style={styles.ctaCard}
          >
            <Text style={styles.ctaTitle}>Change your career math today</Text>
            <Text style={styles.ctaSubtitle}>
              75% of resumes fail ATS. Yours will not — and now you can take the
              power with you.
            </Text>
            <View style={styles.ctaRow}>
              <CTAButton
                label="Build now"
                icon="zap"
                onPress={() => handleLink('https://smartatsresume.com/login')}
                inverted
              />
              <CTAButton
                label="View pricing"
                icon="dollar-sign"
                variant="ghost"
                onPress={() => handleLink('https://smartatsresume.com/pricing')}
                inverted
              />
            </View>
            <Text style={styles.disclaimer}>
              No credit card required · 5 minute setup
            </Text>
          </LinearGradient>

          <View style={styles.footer}>
            <Text style={styles.footerTitle}>SmartATS</Text>
            <Text style={styles.footerSubtitle}>Beat the bots. Land the job.</Text>
            <View style={styles.footerLinks}>
              {footerLinks.map((link) => (
                <Pressable
                  key={link.label}
                  onPress={() => handleLink(link.url)}
                  style={styles.footerLink}
                >
                  <Text style={styles.footerLinkText}>{link.label}</Text>
                  <Feather name="arrow-up-right" size={14} color="#a3a3a3" />
                </Pressable>
              ))}
            </View>
            <Text style={styles.footerCopyright}>
              © {new Date().getFullYear()} SmartATS. All rights reserved.
            </Text>
    </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const CTAButton = ({ label, icon, variant = 'primary', onPress, inverted }) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';

  const backgroundColor = inverted
    ? isGhost
      ? 'transparent'
      : '#fff'
    : isPrimary
    ? '#f97316'
    : '#1f2937';

  const textColor = inverted
    ? isGhost
      ? '#fff'
      : '#f97316'
    : isPrimary
    ? '#0f0f0f'
    : '#f5f5f5';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.ctaButton,
        {
          backgroundColor,
          opacity: pressed ? 0.85 : 1,
          borderColor: isGhost ? '#fff' : 'transparent',
          borderWidth: isGhost ? 1 : 0,
        },
      ]}
    >
      <Feather name={icon} size={16} color={textColor} />
      <Text style={[styles.ctaButtonText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
};

const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionSubtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 24,
  },
  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  logo: {
    width: 56,
    height: 56,
    marginBottom: 12,
  },
  eyebrow: {
    color: '#f97316',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#f5f5f5',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    marginBottom: 12,
  },
  heroSubtitle: {
    color: '#9ca3af',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0f172a',
    borderRadius: 999,
    gap: 6,
  },
  badgeText: {
    color: '#d1d5db',
    fontSize: 12,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  sectionCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  sectionTitle: {
    color: '#f5f5f5',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  trustGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustValue: {
    color: '#fcd34d',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
  },
  trustLabel: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  atsCard: {
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  sectionEyebrow: {
    color: '#fbbf24',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    color: '#9ca3af',
    fontSize: 16,
  },
  scoreValue: {
    color: '#34d399',
    fontSize: 48,
    fontWeight: '700',
  },
  metricsColumn: {
    gap: 12,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricLabel: {
    flex: 1,
    color: '#d1d5db',
  },
  metricBarBackground: {
    flex: 2,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#1f2937',
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#22d3ee',
  },
  metricValue: {
    color: '#f97316',
    fontWeight: '600',
  },
  optimizedPill: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(20, 83, 45, 0.4)',
  },
  optimizedText: {
    color: '#d1fae5',
  },
  sectionHeader: {
    gap: 8,
  },
  sectionSubtitle: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 20,
  },
  perkGrid: {
    flexDirection: 'column',
    gap: 16,
  },
  perkCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#111827',
    gap: 8,
  },
  perkTitle: {
    color: '#f5f5f5',
    fontSize: 18,
    fontWeight: '600',
  },
  perkDescription: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 20,
  },
  templateList: {
    gap: 16,
    paddingVertical: 8,
  },
  templateCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#0f172a',
    marginRight: 16,
    overflow: 'hidden',
  },
  templateImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  templateContent: {
    padding: 16,
    gap: 8,
  },
  templateTitle: {
    color: '#f5f5f5',
    fontSize: 18,
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    color: '#d1d5db',
    fontSize: 12,
  },
  featureCard: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: 12,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    color: '#f5f5f5',
    fontSize: 18,
    fontWeight: '600',
  },
  featureDescription: {
    color: '#9ca3af',
    lineHeight: 20,
  },
  featureBullet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f97316',
  },
  featureBulletText: {
    color: '#d1d5db',
    fontSize: 14,
  },
  comparisonCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#0f172a',
  },
  comparisonRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    gap: 12,
  },
  comparisonFeature: {
    color: '#f5f5f5',
    fontSize: 16,
    fontWeight: '600',
  },
  comparisonBadgeSmart: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    padding: 10,
    borderRadius: 12,
  },
  comparisonBadgeText: {
    color: '#86efac',
  },
  comparisonBadgeOther: {
    backgroundColor: 'rgba(248,113,113,0.15)',
    padding: 10,
    borderRadius: 12,
  },
  comparisonBadgeOtherText: {
    color: '#fecaca',
  },
  pricingGrid: {
    gap: 16,
  },
  pricingCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#111827',
  },
  pricingCardHighlight: {
    borderColor: '#f97316',
    shadowColor: '#f97316',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  pricingName: {
    color: '#f5f5f5',
    fontSize: 20,
    fontWeight: '600',
  },
  pricingValue: {
    color: '#f97316',
    fontSize: 40,
    fontWeight: '700',
    marginVertical: 4,
  },
  pricingCadence: {
    color: '#9ca3af',
    marginBottom: 12,
  },
  recommendedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(249,115,22,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  recommendedText: {
    color: '#ffedd5',
    fontSize: 12,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  planFeatureText: {
    color: '#d1d5db',
  },
  ctaCard: {
    borderRadius: 28,
    padding: 24,
    gap: 16,
  },
  ctaTitle: {
    color: '#fff7ed',
    fontSize: 24,
    fontWeight: '700',
  },
  ctaSubtitle: {
    color: '#fffbeb',
    lineHeight: 22,
  },
  disclaimer: {
    color: '#fed7aa',
    fontSize: 12,
  },
  footer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    gap: 12,
    alignItems: 'center',
  },
  footerTitle: {
    color: '#f5f5f5',
    fontSize: 20,
    fontWeight: '700',
  },
  footerSubtitle: {
    color: '#9ca3af',
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  footerLinkText: {
    color: '#d1d5db',
  },
  footerCopyright: {
    color: '#6b7280',
    fontSize: 12,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    flexGrow: 1,
  },
  ctaButtonText: {
    fontWeight: '600',
  },
});
