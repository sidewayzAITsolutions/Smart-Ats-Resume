import React, { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';

const heroHighlights = [
  { icon: 'check-circle', label: '98.4% ATS pass rate' },
  { icon: 'zap', label: 'AI bullet points in seconds' },
  { icon: 'clock', label: 'Build-ready in 10 minutes' },
];

const trustStats = [
  { icon: 'shield', number: '75%', label: 'Resumes fail ATS' },
  { icon: 'bar-chart-2', number: '60%', label: 'Faster hires' },
  { icon: 'award', number: '94%', label: 'Recruiters use ATS' },
];

const atsReadings = [
  { label: 'Keyword Match', value: 92, color: '#2dd4bf' },
  { label: 'Format Score', value: 96, color: '#fbbf24' },
  { label: 'Readability', value: 94, color: '#fb7185' },
];

const perks = [
  {
    icon: 'smartphone',
    title: 'Pocket Builder',
    description:
      'Edit resumes offline, sync when you regain service, and keep drafts in your pocket.',
  },
  {
    icon: 'share-2',
    title: 'Job Drop',
    description:
      'Share any job post to the app to auto-extract keywords and refresh bullet points.',
  },
  {
    icon: 'bell',
    title: 'Push Intelligence',
    description:
      'Opt into gentle haptic nudges when dream roles drop or templates need fresh data.',
  },
];

const featurePillars = [
  {
    icon: 'cpu',
    title: 'AI Content Genius',
    description:
      'Context-aware generation with role-specific tone, quantified metrics, and STAR frameworks.',
    bullets: [
      'Understands job descriptions instantly',
      'Keeps voice and tense consistent',
      'Suggests achievement metrics automatically',
    ],
  },
  {
    icon: 'activity',
    title: 'ATS Score Engine',
    description:
      'Real-time benchmarking against the same systems Fortune 500 teams use today.',
    bullets: [
      'Live scorecard with pass/fail thresholds',
      'Section-specific diagnostics',
      'Best-practice formatting guardrails',
    ],
  },
];

const templates = [
  {
    id: 'executive',
    title: 'Executive Precision',
    image: require('./assets/2.png'),
    tags: ['VP / C-Suite', 'ATS perfect'],
  },
  {
    id: 'creative',
    title: 'Creative Voltage',
    image: require('./assets/4.png'),
    tags: ['Design', 'Portfolio ready'],
  },
  {
    id: 'growth',
    title: 'Growth Driver',
    image: require('./assets/new1.png'),
    tags: ['Sales', 'Metric heavy'],
  },
  {
    id: 'modern',
    title: 'Modern Minimal',
    image: require('./assets/new.png'),
    tags: ['Universal', 'HR favorite'],
  },
];

const builderSteps = [
  {
    label: 'Import',
    copy: 'Drop your LinkedIn or PDF resume and SmartATS parses everything automatically.',
  },
  {
    label: 'Optimize',
    copy: 'AI suggestions align every bullet with the target JD and ATS ranking factors.',
  },
  {
    label: 'Export',
    copy: 'One tap to ship ATS-clean PDFs or share the mobile-friendly view instantly.',
  },
];

const pricing = [
  {
    name: 'Starter',
    price: 'Free',
    cadence: 'Forever',
    hero: false,
    features: ['1 ATS resume', 'Basic templates', 'Email support', 'PDF export'],
  },
  {
    name: 'Pro',
    price: '$22',
    cadence: 'Monthly',
    hero: true,
    features: [
      'Unlimited resumes',
      'Premium templates',
      'AI optimization',
      'Priority support',
      'Cancel anytime',
    ],
  },
  {
    name: 'Elite',
    price: '$200',
    cadence: 'Yearly',
    hero: false,
    features: [
      'Everything in Pro',
      'Advanced analytics',
      'Custom branding',
      'Dedicated coach calls',
    ],
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
  const templateWidth = useMemo(() => width * 0.72, []);

  const handleLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url).catch(() => {});
  };

  return (
    <LinearGradient colors={['#030712', '#05060a']} style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <HeroSection templateWidth={templateWidth} onLink={handleLink} />

          <View style={styles.sectionCard}>
            <SectionTitle title="Proof it dominates" />
            <View style={styles.trustRow}>
              {trustStats.map((stat) => (
                <View key={stat.label} style={styles.trustCard}>
                  <Feather name={stat.icon} size={22} color="#f59e0b" />
                  <Text style={styles.trustNumber}>{stat.number}</Text>
                  <Text style={styles.trustLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <BlurView tint="dark" intensity={40} style={styles.atsPanel}>
            <Text style={styles.eyebrow}>Live ATS demo</Text>
            <View style={styles.atsScoreRow}>
              <View>
                <Text style={styles.atsScoreLabel}>ATS Score</Text>
                <Text style={styles.atsScoreValue}>94</Text>
              </View>
              <Feather name="activity" size={32} color="#34d399" />
            </View>
            <View style={styles.readings}>
              {atsReadings.map((reading) => (
                <View key={reading.label} style={styles.readingRow}>
                  <Text style={styles.readingLabel}>{reading.label}</Text>
                  <View style={styles.readingTrack}>
                    <View
                      style={[
                        styles.readingFill,
                        { width: `${reading.value}%`, backgroundColor: reading.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.readingValue}>{reading.value}%</Text>
                </View>
              ))}
            </View>
            <View style={styles.optimizedPill}>
              <Feather name="check-circle" size={18} color="#22d3ee" />
              <Text style={styles.optimizedText}>
                Resume cleared ATS gates — submit confidently.
              </Text>
            </View>
          </BlurView>

          <SectionTitle
            eyebrow="Mobile-first perks"
            title="Designed for thumbs and timelines"
          />
          <View style={styles.perkGrid}>
            {perks.map((perk) => (
              <View key={perk.title} style={styles.perkCard}>
                <Feather name={perk.icon} size={22} color="#f97316" />
                <Text style={styles.perkTitle}>{perk.title}</Text>
                <Text style={styles.perkCopy}>{perk.description}</Text>
              </View>
            ))}
          </View>

          <SectionTitle
            eyebrow="Templates"
            title="Swipeable layouts that stay ATS-clean"
          />
          <FlatList
            horizontal
            data={templates}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.templateList}
            renderItem={({ item }) => (
              <View style={[styles.templateCard, { width: templateWidth }]}>
                <Image source={item.image} style={styles.templateImage} />
                <View style={styles.templateMeta}>
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

          <SectionTitle
            eyebrow="Under the hood"
            title="Feature pillars that move metrics"
          />
          {featurePillars.map((pillar) => (
            <View key={pillar.title} style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <View style={styles.iconBadge}>
                  <Feather name={pillar.icon} size={18} color="#fde68a" />
                </View>
                <Text style={styles.featureTitle}>{pillar.title}</Text>
              </View>
              <Text style={styles.featureCopy}>{pillar.description}</Text>
              {pillar.bullets.map((bullet) => (
                <View key={bullet} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          ))}

          <SectionTitle
            eyebrow="Builder flow"
            title="Three guided steps to hired"
          />
          <View style={styles.stepper}>
            {builderSteps.map((step, index) => (
              <View key={step.label} style={styles.stepCard}>
                <LinearGradient
                  colors={['#0f172a', '#0b1120']}
                  style={styles.stepGradient}
                >
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                  <Text style={styles.stepLabel}>{step.label}</Text>
                  <Text style={styles.stepCopy}>{step.copy}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>

          <SectionTitle
            eyebrow="Pricing"
            title="No games. Transparent plans."
          />
          <View style={styles.pricingGrid}>
            {pricing.map((plan) => (
              <View
                key={plan.name}
                style={[
                  styles.pricingCard,
                  plan.hero && styles.pricingHero,
                ]}
              >
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planCadence}>{plan.cadence}</Text>
                {plan.features.map((feature) => (
                  <View key={feature} style={styles.planFeatureRow}>
                    <Feather name="check" size={16} color="#34d399" />
                    <Text style={styles.planFeatureText}>{feature}</Text>
                  </View>
                ))}
                <CTAButton
                  label={plan.hero ? 'Start with Pro' : 'Choose plan'}
                  icon="arrow-right"
                  onPress={() => handleLink('https://smartatsresume.com/pricing')}
                  variant={plan.hero ? 'primary' : 'ghost'}
                />
              </View>
            ))}
          </View>

          <LinearGradient
            colors={['#f97316', '#ea580c']}
            style={styles.ctaBanner}
          >
            <Text style={styles.ctaTitle}>Change your career math today</Text>
            <Text style={styles.ctaSubtitle}>
              75% of resumes fail ATS. Yours never will again — and now, the
              entire builder lives on your phone.
            </Text>
            <View style={styles.ctaActions}>
              <CTAButton
                label="Build now"
                icon="zap"
                onPress={() => handleLink('https://smartatsresume.com/login')}
                invert
              />
              <CTAButton
                label="Talk to sales"
                icon="phone"
                variant="ghost"
                invert
                onPress={() => handleLink('https://smartatsresume.com/contact-sales')}
              />
            </View>
            <Text style={styles.ctaFooter}>
              No credit card required • 5 minute setup
            </Text>
          </LinearGradient>

          <View style={styles.footer}>
            <View style={styles.footerBrand}>
              <Image
                source={require('./assets/horse-logo.png')}
                style={styles.footerLogo}
              />
              <Text style={styles.footerName}>SmartATS</Text>
            </View>
            <Text style={styles.footerTagline}>Beat the bots. Land the job.</Text>
            <View style={styles.footerLinks}>
              {footerLinks.map((link) => (
                <Pressable
                  key={link.label}
                  style={styles.footerLink}
                  onPress={() => handleLink(link.url)}
                >
                  <Text style={styles.footerLinkText}>{link.label}</Text>
                  <Feather name="arrow-up-right" size={14} color="#a3a3a3" />
                </Pressable>
              ))}
            </View>
            <Text style={styles.footerCopy}>
              © {new Date().getFullYear()} SmartATS. All rights reserved.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const HeroSection = ({ templateWidth, onLink }) => (
  <View style={styles.hero}>
    <Image source={require('./assets/horse-logo.png')} style={styles.logo} />
    <Text style={styles.eyebrow}>SmartATS Mobile</Text>
    <Text style={styles.heroTitle}>Beat the bots, now from your phone.</Text>
    <Text style={styles.heroCopy}>
      The same cinematic SmartATS experience recreated for thumb-friendly,
      on-the-go workflows with haptics, gestures, and offline sync.
    </Text>
    <View style={styles.highlightRow}>
      {heroHighlights.map((item) => (
        <View key={item.label} style={styles.highlightPill}>
          <Feather name={item.icon} size={14} color="#34d399" />
          <Text style={styles.highlightText}>{item.label}</Text>
        </View>
      ))}
    </View>
    <View style={styles.ctaActions}>
      <CTAButton
        label="Start building"
        icon="arrow-right"
        onPress={() => onLink('https://smartatsresume.com/login')}
      />
      <CTAButton
        label="See templates"
        icon="grid"
        variant="secondary"
        onPress={() => onLink('https://smartatsresume.com/templates')}
      />
    </View>
    <View style={[styles.templateCard, { width: templateWidth }]}>
      <Image source={require('./assets/3.png')} style={styles.templateImage} />
      <View style={styles.templateMeta}>
        <Text style={styles.templateTitle}>Mobile Dashboard</Text>
        <View style={styles.tagRow}>
          <View style={styles.tagChip}>
            <Text style={styles.tagText}>Live scorecard</Text>
          </View>
          <View style={styles.tagChip}>
            <Text style={styles.tagText}>Realtime AI</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const CTAButton = ({
  label,
  icon,
  onPress,
  variant = 'primary',
  invert = false,
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';

  const backgroundColor = invert
    ? isGhost
      ? 'transparent'
      : '#fff'
    : isPrimary
    ? '#f97316'
    : isSecondary
    ? '#0f172a'
    : 'transparent';

  const textColor = invert
    ? isGhost
      ? '#fff'
      : '#ea580c'
    : isPrimary
    ? '#030712'
    : '#e5e7eb';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.ctaButton,
        {
          backgroundColor,
          borderColor: isGhost ? '#ffffff50' : 'transparent',
          borderWidth: isGhost ? 1 : 0,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Feather name={icon} size={16} color={textColor} />
      <Text style={[styles.ctaButtonText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
};

const SectionTitle = ({ eyebrow, title }) => (
  <View style={styles.sectionHeader}>
    {eyebrow && <Text style={styles.sectionEyebrow}>{eyebrow}</Text>}
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
    gap: 24,
  },
  hero: {
    backgroundColor: '#0f172a',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: 16,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  eyebrow: {
    color: '#fbbf24',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  heroCopy: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 24,
  },
  highlightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  highlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#020617',
    borderRadius: 999,
    gap: 6,
  },
  highlightText: {
    color: '#cbd5f5',
    fontSize: 12,
  },
  ctaActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sectionCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  sectionHeader: {
    gap: 6,
  },
  sectionEyebrow: {
    color: '#f97316',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '600',
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  trustCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#0b1120',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  trustNumber: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },
  trustLabel: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 12,
  },
  atsPanel: {
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  atsScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  atsScoreLabel: {
    color: '#cbd5f5',
  },
  atsScoreValue: {
    color: '#34d399',
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 48,
  },
  readings: {
    gap: 12,
  },
  readingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  readingLabel: {
    flex: 1,
    color: '#e2e8f0',
  },
  readingTrack: {
    flex: 2,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#0b1120',
    overflow: 'hidden',
  },
  readingFill: {
    height: '100%',
    borderRadius: 999,
  },
  readingValue: {
    color: '#f97316',
    fontWeight: '600',
  },
  optimizedPill: {
    marginTop: 20,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(45,212,191,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optimizedText: {
    color: '#d1fae5',
    flex: 1,
  },
  perkGrid: {
    gap: 16,
  },
  perkCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#0b1120',
    padding: 20,
    gap: 8,
  },
  perkTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
  },
  perkCopy: {
    color: '#94a3b8',
    lineHeight: 20,
  },
  templateList: {
    paddingVertical: 4,
    gap: 16,
  },
  templateCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#020617',
    overflow: 'hidden',
    marginRight: 16,
  },
  templateImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  templateMeta: {
    padding: 16,
    gap: 10,
  },
  templateTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#0f172a',
  },
  tagText: {
    color: '#cbd5f5',
    fontSize: 12,
  },
  featureCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#0b1120',
    padding: 20,
    gap: 12,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
  },
  featureCopy: {
    color: '#94a3b8',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f97316',
  },
  bulletText: {
    color: '#cbd5f5',
  },
  stepper: {
    gap: 12,
  },
  stepCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
    overflow: 'hidden',
  },
  stepGradient: {
    padding: 20,
    gap: 8,
  },
  stepNumber: {
    color: '#38bdf8',
    fontSize: 32,
    fontWeight: '700',
  },
  stepLabel: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
  },
  stepCopy: {
    color: '#94a3b8',
    lineHeight: 20,
  },
  pricingGrid: {
    gap: 16,
  },
  pricingCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#0b1120',
    padding: 20,
    gap: 12,
  },
  pricingHero: {
    borderColor: '#f97316',
    shadowColor: '#f97316',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  planName: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '600',
  },
  planPrice: {
    color: '#f97316',
    fontSize: 40,
    fontWeight: '700',
  },
  planCadence: {
    color: '#94a3b8',
    marginBottom: 8,
  },
  planFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planFeatureText: {
    color: '#cbd5f5',
  },
  ctaBanner: {
    borderRadius: 28,
    padding: 24,
    gap: 14,
  },
  ctaTitle: {
    color: '#fff7ed',
    fontSize: 24,
    fontWeight: '700',
  },
  ctaSubtitle: {
    color: '#ffedd5',
    lineHeight: 20,
  },
  ctaFooter: {
    color: '#fed7aa',
    fontSize: 12,
  },
  ctaActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 150,
  },
  ctaButtonText: {
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    paddingTop: 24,
    gap: 12,
    alignItems: 'center',
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerLogo: {
    width: 32,
    height: 32,
  },
  footerName: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  footerTagline: {
    color: '#94a3b8',
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
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
    color: '#cbd5f5',
  },
  footerCopy: {
    color: '#6b7280',
    fontSize: 12,
  },
});
