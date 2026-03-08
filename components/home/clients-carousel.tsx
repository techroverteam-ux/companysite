'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import clientsDataRaw from '@/data/clients.json'
import { decrypt } from '@/lib/auth'

interface ClientItem {
  id: string
  name: string
  logo: string
  country: string
  industry: string
  projectsCompleted: number
  totalValue: string
  description: string
}

interface ClientsCarouselProps {
  clients: string[]
}

export function ClientsCarousel({ clients }: ClientsCarouselProps) {
  const decrypted = (clientsDataRaw as { data?: unknown }).data
  const clientsData: ClientItem[] =
    typeof decrypted === 'string'
      ? (decrypt(decrypted) as ClientItem[] | null) || []
      : (clientsDataRaw as ClientItem[])

  const marqueeItems = [...clientsData, ...clientsData]

  const sectionEase = [0.22, 1, 0.36, 1] as const
  const laneDuration = Math.max(20, clientsData.length * 5)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: sectionEase }}
          viewport={{ once: true }}
          className="mb-14 text-center sm:mb-16"
        >
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
            TRUST SIGNAL
          </div>

          <h3 className="mx-auto max-w-4xl text-balance text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Trusted by <span className="gradient-text">Leading Companies</span> Worldwide
          </h3>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-[1.85] text-muted-foreground sm:text-lg">
            Join {Math.max(clients.length, clientsData.length) * 10}+ companies across multiple countries that rely on TechRover to build, scale, and modernize digital products.
          </p>

          <div className="mx-auto mt-9 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { value: '100+', label: 'Happy Clients' },
              { value: '8+', label: 'Countries' },
              { value: '500+', label: 'Projects' },
              { value: '99%', label: 'Satisfaction' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: sectionEase, delay: 0.08 * index }}
                viewport={{ once: true }}
                className="rounded-xl border border-border/80 bg-card/70 px-4 py-4 text-center backdrop-blur"
              >
                <div className="text-2xl font-semibold tracking-tight sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs tracking-[0.06em] text-muted-foreground sm:text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="relative overflow-hidden">

          <motion.div
            className="flex gap-5 will-change-transform"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: laneDuration, ease: 'linear', repeat: Infinity }}
          >
            {marqueeItems.map((client, index) => (
              <Card
                key={`${client.id}-${index}`}
                className="min-w-[19.5rem] max-w-[19.5rem] border-border/70 bg-card/80 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <CardContent className="flex h-full flex-col gap-4 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/20 text-xl">
                      {client.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-base font-semibold text-foreground">{client.name}</h4>
                      <p className="mt-0.5 text-xs tracking-[0.06em] text-muted-foreground">{client.industry} • {client.country}</p>
                    </div>
                  </div>

                  <p className="line-clamp-2 text-sm leading-[1.75] text-muted-foreground">{client.description}</p>

                  <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-3">
                    <p className="text-sm font-medium text-secondary">{client.projectsCompleted} Projects</p>
                    <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary">
                      {client.totalValue}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <motion.div
            className="mt-5 flex gap-5 will-change-transform"
            animate={{ x: ['-50%', '0%'] }}
            transition={{ duration: laneDuration + 6, ease: 'linear', repeat: Infinity }}
          >
            {marqueeItems.map((client, index) => (
              <div
                key={`secondary-${client.id}-${index}`}
                className="flex min-w-[12rem] items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur"
              >
                <span className="text-base">{client.logo}</span>
                <span className="truncate">{client.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}