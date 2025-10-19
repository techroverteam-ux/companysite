import { HeroSection } from '@/components/home/hero-section'
import { ServicesPreview } from '@/components/home/services-preview'
import { StatsSection } from '@/components/home/stats-section'
import { PortfolioPreview } from '@/components/home/portfolio-preview'
import { ReviewsPreview } from '@/components/home/reviews-preview'
import { AboutPreview } from '@/components/home/about-preview'
import { ClientsCarousel } from '@/components/home/clients-carousel'
import { MarketingBanner } from '@/components/home/marketing-banner'
import { DiwaliOffers } from '@/components/home/diwali-offers'
import { AutomationBanner } from '@/components/home/automation-banner'
import { AutomationSection } from '@/components/home/automation-section'
import { WorldMap } from '@/components/home/world-map'
import { TechyBot } from '@/components/chatbot/techy-bot'
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

  const isDiwaliActive = marketingData.activeCampaign?.isActive && 
    new Date() >= new Date(marketingData.activeCampaign?.startDate) && 
    new Date() <= new Date(marketingData.activeCampaign?.endDate)

  const isPostDiwaliActive = marketingData.postDiwaliCampaign?.isActive && 
    new Date() >= new Date(marketingData.postDiwaliCampaign?.startDate) && 
    new Date() <= new Date(marketingData.postDiwaliCampaign?.endDate)

  return (
    <div className="pt-16">
      {isDiwaliActive && <MarketingBanner campaign={marketingData.activeCampaign} />}
      {isPostDiwaliActive && <AutomationBanner campaign={marketingData.postDiwaliCampaign} />}
      <HeroSection data={homeData.hero} />
      <ClientsCarousel clients={homeData.clients} />
      <ServicesPreview services={homeData.services} />
      {isDiwaliActive && <DiwaliOffers campaign={marketingData.activeCampaign} />}
      {isPostDiwaliActive && <AutomationSection campaign={marketingData.postDiwaliCampaign} />}
      <AboutPreview data={aboutData} />
      <PortfolioPreview projects={portfolioData} />
      <WorldMap />
      <StatsSection stats={homeData.stats} />
      <ReviewsPreview reviews={reviewsData} />
      <TechyBot />
    </div>
  )
}