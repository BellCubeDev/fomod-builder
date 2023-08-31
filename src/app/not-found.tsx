'use client';

import {redirect} from 'next/navigation';

export default function GoToHomepage() {
    return redirect('/');
}
