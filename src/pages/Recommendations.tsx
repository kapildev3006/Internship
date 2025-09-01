import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { MapPin, DollarSign, Users, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { RecommendationResponse } from '@/types';

export function Recommendations() {
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('recommendations');
    if (stored) {
      setRecommendations(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (recommendations && cardsRef.current) {
      gsap.fromTo(cardsRef.current.children,
        { opacity: 0, y: 50, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          stagger: 0.2, 
          ease: 'back.out(1.7)' 
        }
      );
    }
  }, [recommendations]);

  if (!recommendations) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('recommendations.title')}
          </h1>
          <p className="text-gray-600">
            {t('recommendations.noResults')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {t('recommendations.title')}
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" ref={cardsRef}>
          {recommendations.internships.map((internship, index) => (
            <Card key={internship.id} className="hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {internship.title}
                  </CardTitle>
                  <Badge variant="secondary">
                    {Math.round(recommendations.match_scores[index] * 100)}% match
                  </Badge>
                </div>
                <Badge variant="outline" className="w-fit">
                  {internship.department}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {internship.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    ₹{internship.stipend.toLocaleString()}/month
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {internship.capacity} positions
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {internship.skills_required.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {internship.skills_required.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{internship.skills_required.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                <Button className="w-full group">
                  {t('recommendations.apply')}
                  <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}