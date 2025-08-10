console.log('--- SQL Commands to Reset Supabase Sequences ---');
console.log('Please run these commands directly in your Supabase SQL editor or via a PostgreSQL client.');
console.log(''); // Empty line for spacing
console.log('-- Resetting sequences for main tables --');
console.log('ALTER SEQUENCE "public"."Token_id_seq" RESTART WITH 1;');
console.log('ALTER SEQUENCE "public"."Pair_id_seq" RESTART WITH 1;');
console.log('ALTER SEQUENCE "public"."OhlcData_id_seq" RESTART WITH 1;');
console.log('ALTER SEQUENCE "public"."EventTracking_id_seq" RESTART WITH 1;');
console.log('ALTER SEQUENCE "public"."BlockProgress_id_seq" RESTART WITH 1;');
console.log(''); // Empty line for spacing
console.log('--- End of SQL Commands ---');
