import React from 'react';
import { LoaderCircle } from 'lucide-react';

export const Spinner = () => (
    <div className="flex flex-col items-center justify-center gap-4">
        <LoaderCircle className="h-12 w-12 text-sage animate-spin" />
    </div>
);