import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import type { Candidate } from '@/types';

const EDUCATION_OPTIONS = [
  'High School', 'Diploma', 'Bachelor\'s', 'Master\'s', 'PhD'
];

const SKILLS_OPTIONS = [
  'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'Excel', 
  'PowerPoint', 'Communication', 'Leadership', 'Project Management',
  'Data Analysis', 'Marketing', 'Finance', 'Healthcare', 'Teaching'
];

const INTEREST_OPTIONS = [
  'IT', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Operations'
];

const LOCATION_OPTIONS = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad', 'Remote'
];

export function CandidateForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Candidate>({
    name: '',
    education: '',
    skills: [],
    interests: [],
    location: ''
  });

  const totalSteps = 3;

  useEffect(() => {
    gsap.fromTo(formRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, [currentStep]);

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const recommendations = await response.json();
        localStorage.setItem('recommendations', JSON.stringify(recommendations));
        toast({
          title: 'Success!',
          description: 'Found matching internships for you.',
        });
        navigate('/recommendations');
      } else {
        throw new Error('Failed to get recommendations');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get recommendations. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '' && formData.education !== '';
      case 2:
        return formData.skills.length > 0;
      case 3:
        return formData.interests.length > 0 && formData.location !== '';
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            {t('form.title')}
          </h1>
          <div className="mb-4">
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            <p className="text-sm text-gray-600 mt-2 text-center">
              {t('form.step', { current: currentStep, total: totalSteps })}
            </p>
          </div>
        </div>

        <Card className="shadow-xl" ref={formRef}>
          <CardHeader>
            <CardTitle className="text-center">
              {currentStep === 1 && 'Basic Information'}
              {currentStep === 2 && 'Skills & Expertise'}
              {currentStep === 3 && 'Preferences'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">{t('form.name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('form.education')}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {EDUCATION_OPTIONS.map((edu) => (
                      <Button
                        key={edu}
                        variant={formData.education === edu ? 'default' : 'outline'}
                        onClick={() => setFormData(prev => ({ ...prev, education: edu }))}
                        className="justify-start"
                      >
                        {edu}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <Label>{t('form.skills')}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SKILLS_OPTIONS.map((skill) => (
                    <Badge
                      key={skill}
                      variant={formData.skills.includes(skill) ? 'default' : 'outline'}
                      className="cursor-pointer p-2 justify-center hover:scale-105 transition-transform"
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Selected: {formData.skills.length} skills
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <>
                <div className="space-y-4">
                  <Label>{t('form.interests')}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {INTEREST_OPTIONS.map((interest) => (
                      <Button
                        key={interest}
                        variant={formData.interests.includes(interest) ? 'default' : 'outline'}
                        onClick={() => handleInterestToggle(interest)}
                        className="justify-start"
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('form.location')}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {LOCATION_OPTIONS.map((loc) => (
                      <Button
                        key={loc}
                        variant={formData.location === loc ? 'default' : 'outline'}
                        onClick={() => setFormData(prev => ({ ...prev, location: loc }))}
                        className="justify-start"
                      >
                        {loc}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                  className="flex items-center"
                >
                  {t('form.submit')}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}