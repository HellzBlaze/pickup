
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Using RadioGroup for selection behavior

interface TipSelectorProps {
  subtotal: number;
  onTipChange: (tipAmount: number) => void;
}

const tipPercentages = [
    { label: '10%', value: 0.10 },
    { label: '15%', value: 0.15 },
    { label: '20%', value: 0.20 },
    { label: '25%', value: 0.25 },
];

export default function TipSelector({ subtotal, onTipChange }: TipSelectorProps) {
  const [selectedTipType, setSelectedTipType] = useState<string>('15%'); // Default to 15%
  const [customTip, setCustomTip] = useState<string>('');

  useEffect(() => {
    let tip = 0;
    if (selectedTipType === 'custom') {
      tip = parseFloat(customTip) || 0;
    } else {
      const percentageOption = tipPercentages.find(p => p.label === selectedTipType);
      if (percentageOption) {
        tip = subtotal * percentageOption.value;
      }
    }
    onTipChange(parseFloat(tip.toFixed(2))); // Ensure two decimal places
  }, [selectedTipType, customTip, subtotal, onTipChange]);

  return (
    <div className="space-y-4">
      <RadioGroup 
        value={selectedTipType} 
        onValueChange={(value) => {
          setSelectedTipType(value);
          if (value !== 'custom') setCustomTip(''); // Clear custom input if preset is chosen
        }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-2"
        aria-label="Select tip amount"
      >
        {tipPercentages.map(p => (
          <div key={p.label}>
            <RadioGroupItem value={p.label} id={`tip-${p.label}`} className="sr-only" />
            <Label
              htmlFor={`tip-${p.label}`}
              className={`block w-full cursor-pointer rounded-md border p-3 text-center text-sm font-medium transition-colors
                          ${selectedTipType === p.label 
                            ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary ring-offset-2' 
                            : 'bg-card hover:bg-muted'}`}
            >
              {p.label} (₹{(subtotal * p.value).toFixed(2)})
            </Label>
          </div>
        ))}
        <div>
            <RadioGroupItem value="custom" id="tip-custom" className="sr-only" />
            <Label
              htmlFor="tip-custom"
              className={`block w-full cursor-pointer rounded-md border p-3 text-center text-sm font-medium transition-colors
                          ${selectedTipType === 'custom' 
                            ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary ring-offset-2' 
                            : 'bg-card hover:bg-muted'}`}
            >
              Custom
            </Label>
          </div>
      </RadioGroup>

      {selectedTipType === 'custom' && (
        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium">₹</span>
          <Input
            type="number"
            aria-label="Custom tip amount"
            placeholder="Enter tip amount"
            value={customTip}
            onChange={(e) => setCustomTip(e.target.value)}
            className="flex-grow"
            min="0"
            step="0.01"
          />
        </div>
      )}
    </div>
  );
}
