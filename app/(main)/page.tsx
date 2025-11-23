import { EnhancedHeroSection } from '@/components/home/enhanced-hero-section'
import { ServicesPreview } from '@/components/home/services-preview'
import { EnhancedStatsSection } from '@/components/home/enhanced-stats-section'
import { PortfolioPreview } from '@/components/home/portfolio-preview'
import { ReviewsPreview } from '@/components/home/reviews-preview'
import { AboutPreview } from '@/components/home/about-preview'
import { ClientsCarousel } from '@/components/home/clients-carousel'
import { MarketingBanner } from '@/components/home/marketing-banner'

import { AutomationBanner } from '@/components/home/automation-banner'
import { AutomationSection } from '@/components/home/automation-section'
import { SuccessStories } from '@/components/home/success-stories'
import { NewYear2026Campaign } from '@/components/home/new-year-2026-campaign'
import { NewYearBanner } from '@/components/home/new-year-banner'
import { UpcomingProducts } from '@/components/home/upcoming-products'
import { MarketingStrategyShowcase } from '@/components/home/marketing-strategy-showcase'
import { WorldMap } from '@/components/home/world-map'
import { TechyBot } from '@/components/chatbot/techy-bot'
import { FloatingElements } from '@/components/ui/floating-elements'
import homeData from '@/data/home.json'
import portfolioDataRaw from '@/data/portfolio.json'
import reviewsDataRaw from '@/data/reviews.json'
import aboutData from '@/data/about.json'
import marketingData from '@/data/marketing.json'
import { decrypt } from '@/lib/auth'

export default function HomePage() {
  // Decrypt reviews data if encrypted
  const reviewsData = reviewsDataRaw.data && typeof reviewsDataRaw.data === 'string' 
    ? decrypt(reviewsDataRaw.data) || []
    : reviewsDataRaw || []

  // Decrypt portfolio data if encrypted
  const portfolioData = portfolioDataRaw.data && typeof portfolioDataRaw.data === 'string'
    ? decrypt(portfolioDataRaw.data) || []
    : portfolioDataRaw || []

  const isPostDiwaliActive = marketingData.postDiwaliCampaign?.isActive && 
    new Date() >= new Date(marketingData.postDiwaliCampaign?.startDate) && 
    new Date() <= new Date(marketingData.postDiwaliCampaign?.endDate)

  const isNewYear2026Active = marketingData.newYear2026Campaign?.isActive && 
    new Date() >= new Date(marketingData.newYear2026Campaign?.startDate) && 
    new Date() <= new Date(marketingData.newYear2026Campaign?.endDate)

  return (
    <div className={isNewYear2026Active ? "pt-28" : "pt-16"}>
      <FloatingElements />
      {isNewYear2026Active && <NewYearBanner campaign={marketingData.newYear2026Campaign} />}
      {isPostDiwaliActive && <AutomationBanner campaign={marketingData.postDiwaliCampaign} />}
      <EnhancedHeroSection data={homeData.hero} />
      <ClientsCarousel clients={homeData.clients} />
      <ServicesPreview services={homeData.services} />
      {isPostDiwaliActive && <AutomationSection campaign={marketingData.postDiwaliCampaign} />}
      <AboutPreview data={aboutData} />
      <SuccessStories />
      <UpcomingProducts />
      <MarketingStrategyShowcase />
      {isNewYear2026Active && <NewYear2026Campaign campaign={marketingData.newYear2026Campaign} />}
      <PortfolioPreview projects={portfolioData} />
      <WorldMap />
      <EnhancedStatsSection stats={homeData.stats} />
      <ReviewsPreview reviews={reviewsData} />
      <TechyBot />
    </div>
  )
}