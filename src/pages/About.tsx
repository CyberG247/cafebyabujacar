import founderImg from '@/assets/founder.jpg';
import { Award, Target, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl font-bold mb-6 text-center">About Café By ABUJA CAR</h1>
          <p className="text-lg text-muted-foreground text-center mb-12">
            Where luxury meets exceptional taste
          </p>

          <div className="prose max-w-none mb-16">
            <p className="text-lg leading-relaxed mb-6">
              Café By ABUJA CAR represents the perfect fusion of premium quality, luxury service, 
              and exceptional taste. Located in the heart of Kado, Abuja, we bring you an 
              unparalleled dining experience that reflects the excellence and sophistication 
              of the ABUJA CAR brand.
            </p>
            <p className="text-lg leading-relaxed">
              Our commitment to quality extends beyond our menu. Every cup of coffee, every meal, 
              and every customer interaction is crafted with meticulous attention to detail, 
              ensuring an experience that embodies luxury and satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-card rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Only the finest ingredients and expertly trained staff
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                Committed to exceeding expectations in every aspect
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Customer First</h3>
              <p className="text-muted-foreground">
                Your satisfaction is our top priority
              </p>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8 mb-12">
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">Our Founder</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src={founderImg}
                  alt="Sadiq Saminu Geidam"
                  className="rounded-lg shadow-primary w-full"
                />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold mb-4">Sadiq Saminu Geidam</h3>
                <p className="text-muted-foreground mb-4">
                  Founder & CEO of AbujaCar Properties and Automobile Limited
                </p>
                <div className="space-y-3 text-sm">
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
                    His commitment to excellence and innovation has made AbujaCar a pioneer in 
                    bringing luxury and electric vehicles to the Nigerian market.
                  </p>
                  <p>
                    Beyond business, Sadiq is passionate about reading, fitness, and private aviation. 
                    His vision extends beyond commerce - he aims to empower people of all backgrounds 
                    while elevating service standards in Nigeria's automotive and hospitality sectors.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-lg p-8 text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg opacity-95 max-w-2xl mx-auto">
              To become the premier destination for luxury dining in Abuja, setting new standards 
              for quality, service, and customer satisfaction while creating memorable experiences 
              that reflect the excellence of the ABUJA CAR brand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;