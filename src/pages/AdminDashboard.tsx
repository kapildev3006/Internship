import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Internship, Department } from '@/types';
import { DEPARTMENTS } from '@/types';

export function AdminDashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const [newInternship, setNewInternship] = useState<Partial<Internship>>({
    title: '',
    sector: '',
    skills_required: [],
    location: '',
    stipend: 0,
    capacity: 1,
    department: 'IT'
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    if (selectedDepartment === 'all') {
      setFilteredInternships(internships);
    } else {
      setFilteredInternships(internships.filter(i => i.department === selectedDepartment));
    }
  }, [internships, selectedDepartment]);

  useEffect(() => {
    if (tableRef.current) {
      gsap.fromTo(tableRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [filteredInternships]);

  const fetchInternships = async () => {
    try {
      const response = await fetch('http://localhost:5000/internships');
      if (response.ok) {
        const data = await response.json();
        setInternships(data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch internships',
        variant: 'destructive',
      });
    }
  };

  const handleAddInternship = async () => {
    try {
      const response = await fetch('http://localhost:5000/add_internship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInternship),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Internship added successfully',
        });
        setIsAddDialogOpen(false);
        setNewInternship({
          title: '',
          sector: '',
          skills_required: [],
          location: '',
          stipend: 0,
          capacity: 1,
          department: 'IT'
        });
        fetchInternships();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add internship',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteInternship = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_internship/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Internship deleted successfully',
        });
        fetchInternships();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete internship',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('admin.title')}
          </h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                {t('admin.addNew')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Internship</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newInternship.title}
                    onChange={(e) => setNewInternship(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={newInternship.department}
                    onValueChange={(value) => setNewInternship(prev => ({ ...prev, department: value as Department }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newInternship.location}
                    onChange={(e) => setNewInternship(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="stipend">Stipend (₹)</Label>
                  <Input
                    id="stipend"
                    type="number"
                    value={newInternship.stipend}
                    onChange={(e) => setNewInternship(prev => ({ ...prev, stipend: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newInternship.capacity}
                    onChange={(e) => setNewInternship(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <Button onClick={handleAddInternship} className="w-full">
                  {t('admin.save')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('admin.filter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.all')}</SelectItem>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4" ref={tableRef}>
          {filteredInternships.map((internship) => (
            <Card key={internship.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{internship.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary">{internship.department}</Badge>
                      <span className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {internship.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteInternship(internship.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                    ₹{internship.stipend.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-blue-600" />
                    {internship.capacity} positions
                  </div>
                  <div className="col-span-2">
                    <div className="flex flex-wrap gap-1">
                      {internship.skills_required.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {internship.skills_required.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{internship.skills_required.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}