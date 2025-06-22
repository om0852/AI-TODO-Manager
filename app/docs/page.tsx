// app/docs/page.tsx
'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function SwaggerDocsPage() {
  return <SwaggerUI url="/api/docs" />;
}
