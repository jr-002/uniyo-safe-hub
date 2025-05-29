
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Trash2, Mail, Phone } from 'lucide-react';
import { useSafetyTimer } from '@/hooks/useSafetyTimer';

const GuardianManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGuardian, setNewGuardian] = useState({
    guardian_name: '',
    guardian_email: '',
    guardian_phone: '',
  });
  const { guardians, addGuardian, removeGuardian } = useSafetyTimer();

  const handleAddGuardian = async () => {
    if (!newGuardian.guardian_name.trim()) return;
    
    await addGuardian({
      guardian_name: newGuardian.guardian_name,
      guardian_email: newGuardian.guardian_email || undefined,
      guardian_phone: newGuardian.guardian_phone || undefined,
    });

    setNewGuardian({ guardian_name: '', guardian_email: '', guardian_phone: '' });
    setIsAddDialogOpen(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-uniuyo-red" />
          <h2 className="text-xl font-semibold">Guardian Network</h2>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-uniuyo-red hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Guardian
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Guardian</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newGuardian.guardian_name}
                  onChange={(e) => setNewGuardian(prev => ({ ...prev, guardian_name: e.target.value }))}
                  placeholder="Guardian's full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newGuardian.guardian_email}
                  onChange={(e) => setNewGuardian(prev => ({ ...prev, guardian_email: e.target.value }))}
                  placeholder="guardian@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newGuardian.guardian_phone}
                  onChange={(e) => setNewGuardian(prev => ({ ...prev, guardian_phone: e.target.value }))}
                  placeholder="+1234567890"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddGuardian}
                  disabled={!newGuardian.guardian_name.trim()}
                  className="bg-uniuyo-red hover:bg-red-700"
                >
                  Add Guardian
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {guardians.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Guardians Yet</h3>
          <p className="text-gray-500 mb-4">
            Add trusted contacts who will be notified if your safety timer expires
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {guardians.map((guardian) => (
            <div key={guardian.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium">{guardian.guardian_name}</h3>
                <div className="flex items-center space-x-4 mt-1">
                  {guardian.guardian_email && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span>{guardian.guardian_email}</span>
                    </div>
                  )}
                  {guardian.guardian_phone && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{guardian.guardian_phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeGuardian(guardian.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default GuardianManagement;
