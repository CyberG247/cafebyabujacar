import founderImg from '@/assets/founder.jpg';
import { Award, Target, Users } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { ScrollReveal } from '@/components/ScrollReveal';

const About = () => {
  return (
    <PageTransition className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        <ScrollReveal className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-center text-primary-dark">About Café By ABUJA CAR</h1>
          <p className="text-xl text-muted-foreground text-center">
            Where luxury meets exceptional taste
          </p>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          <ScrollReveal animation="fade-up" delay={0.1} className="prose max-w-none mb-20 text-center">
            <p className="text-xl leading-relaxed mb-6 font-light">
              Café By ABUJA CAR represents the perfect fusion of premium quality, luxury service, 
              and exceptional taste. Located in the heart of Kado, Abuja, we bring you an 
              unparalleled dining experience that reflects the excellence and sophistication 
              of the ABUJA CAR brand.
            </p>
            <p className="text-xl leading-relaxed font-light">
              Our commitment to quality extends beyond our menu. Every cup of coffee, every meal, 
              and every customer interaction is crafted with meticulous attention to detail, 
              ensuring an experience that embodies luxury and satisfaction.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <ScrollReveal animation="scale-up" delay={0.2} className="h-full">
              <div className="text-center p-8 bg-card rounded-2xl hover:shadow-xl transition-shadow h-full border border-primary/5">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-semibold mb-3">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Only the finest ingredients and expertly trained staff
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="scale-up" delay={0.3} className="h-full">
              <div className="text-center p-8 bg-card rounded-2xl hover:shadow-xl transition-shadow h-full border border-primary/5">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                  <Target className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-semibold mb-3">Excellence</h3>
                <p className="text-muted-foreground">
                  Committed to exceeding expectations in every aspect
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="scale-up" delay={0.4} className="h-full">
              <div className="text-center p-8 bg-card rounded-2xl hover:shadow-xl transition-shadow h-full border border-primary/5">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-semibold mb-3">Customer First</h3>
                <p className="text-muted-foreground">
                  Your satisfaction is our top priority
                </p>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal animation="fade-up" className="bg-card rounded-3xl p-8 md:p-12 mb-20 shadow-lg border border-primary/10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-10 text-center">Our Founder</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative group overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                  src={founderImg}
                  alt="Sadiq Saminu Geidam"
                  className="rounded-2xl shadow-2xl w-full transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold mb-2 text-primary">Sadiq Saminu Geidam</h3>
                <p className="text-muted-foreground font-medium mb-6 uppercase tracking-wider text-sm">
                  Founder & CEO
                </p>
                <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                  <p>
                    Born in Abuja and a proud descendant of Geidam Local Government, Yobe State, 
                    Sadiq Saminu Geidam is a visionary entrepreneur who has redefined luxury 
                    automobile sales in Nigeria.
                  </p>
                  <p>
                    With a Bachelor's degree in Computer Science from Alhikmah University, Ilorin, 
                    Sadiq combines technical expertise with business acumen to create exceptional 
                    customer experiences.
                  </p>
                  <p>
                    Under his leadership, AbujaCar has achieved remarkable milestones, including 
                    selling Nigeria's most expensive car ever - the McLaren Senna Exposed Carbon. 
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="scale-up" className="bg-gradient-to-br from-primary to-primary-dark text-primary-foreground rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Our Vision</h2>
              <p className="text-xl opacity-95 max-w-3xl mx-auto leading-relaxed font-light">
                To become the premier destination for luxury dining in Abuja, setting new standards 
                for quality, service, and customer satisfaction while creating memorable experiences 
                that reflect the excellence of the ABUJA CAR brand.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;