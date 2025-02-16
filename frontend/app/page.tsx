import React from "react";
import { ChevronRight, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import ActionButton from "@/components/action-button";

const HomePage: React.FC = () => {
  return (
    <>
      <div className="fixed right-0 top-0 m-4 z-10">
        <ThemeToggle />
      </div>
      <div className="min-h-screen bg-background">
        {/* Hero Section with Dynamic Background */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Abstract Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(30deg,#ffffff12_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="absolute inset-0 blur-3xl">
              <div className="absolute -inset-1/2 bg-gradient-to-r from-primary-foreground/20 to-transparent rotate-12 transform-gpu" />
            </div>
          </div>
          <Container className="relative z-10 py-24">
            <div className="max-w-4xl">
              <Badge variant="secondary" className="mb-6 text-lg px-6 py-2">
                Train Smarter, Run Faster
              </Badge>
              <h1 className="text-7xl font-bold mb-8 text-primary-foreground leading-tight">
                Your Journey to
                <br />
                Running Excellence
              </h1>
              <p className="text-xl mb-12 text-primary-foreground/90 max-w-2xl">
                Elite training plans, advanced analytics, and performance
                tracking in one powerful platform. Join the next generation of
                runners.
              </p>
              <div className="flex gap-6 items-center">
                <ActionButton
                  className="text-lg px-8 h-14"
                  route="/login"
                >
                  Start Your Journey
                </ActionButton>
              </div>

              {/* Stats Row */}
              <div className="mt-24 grid grid-cols-3 gap-12 max-w-3xl">
                <StatItem number="50K+" label="Active Runners" />
                <StatItem number="98%" label="Success Rate" />
                <StatItem
                  number="4.9"
                  label="User Rating"
                  icon={<Star className="w-4 h-4 text-yellow-400" />}
                />
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

interface StatItemProps {
  number: string;
  label: string;
  icon?: React.ReactNode;
}

const StatItem: React.FC<StatItemProps> = ({ number, label, icon }) => {
  return (
    <div className="text-primary-foreground/90">
      <div className="flex items-center gap-1 text-3xl font-bold mb-1">
        {number}
        {icon}
      </div>
      <div className="text-primary-foreground/70">{label}</div>
    </div>
  );
};

export default HomePage;
