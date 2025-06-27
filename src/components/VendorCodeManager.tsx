
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Copy } from 'lucide-react';

interface VendorCode {
  id: string;
  code: string;
  isUsed: boolean;
  usedBy?: string;
  createdAt: string;
}

const VendorCodeManager = () => {
  const [codes, setCodes] = useState<VendorCode[]>([]);
  const [newCodeCount, setNewCodeCount] = useState(1);

  useEffect(() => {
    const savedCodes = localStorage.getItem('vendor_codes');
    if (savedCodes) {
      setCodes(JSON.parse(savedCodes));
    }
  }, []);

  const generateCodes = () => {
    const newCodes: VendorCode[] = [];
    for (let i = 0; i < newCodeCount; i++) {
      const code = 'VND-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      newCodes.push({
        id: Date.now().toString() + i,
        code,
        isUsed: false,
        createdAt: new Date().toISOString()
      });
    }
    const updatedCodes = [...codes, ...newCodes];
    setCodes(updatedCodes);
    localStorage.setItem('vendor_codes', JSON.stringify(updatedCodes));
    setNewCodeCount(1);
  };

  const deleteCode = (id: string) => {
    const updatedCodes = codes.filter(code => code.id !== id);
    setCodes(updatedCodes);
    localStorage.setItem('vendor_codes', JSON.stringify(updatedCodes));
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-green-400">Vendor Registration Codes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="codeCount">Generate Codes</Label>
            <Input
              id="codeCount"
              type="number"
              min="1"
              max="50"
              value={newCodeCount}
              onChange={(e) => setNewCodeCount(parseInt(e.target.value) || 1)}
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <Button onClick={generateCodes} className="bg-green-600 hover:bg-green-700 mt-6">
            <Plus className="h-4 w-4 mr-2" />
            Generate
          </Button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {codes.map((codeItem) => (
            <div key={codeItem.id} className="flex items-center justify-between bg-gray-700 p-3 rounded">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <code className="text-green-400 font-mono">{codeItem.code}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCode(codeItem.code)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-xs text-gray-400">
                  {codeItem.isUsed ? (
                    <span>Used by: {codeItem.usedBy}</span>
                  ) : (
                    <span>Available</span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteCode(codeItem.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-gray-700 p-3 rounded text-sm">
          <p className="text-gray-300">
            Total Codes: {codes.length} | 
            Available: {codes.filter(c => !c.isUsed).length} | 
            Used: {codes.filter(c => c.isUsed).length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorCodeManager;
