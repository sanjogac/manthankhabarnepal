import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function executeSql(sqlFile) {
  try {
    const filePath = path.join(process.cwd(), 'scripts', sqlFile)
    const sql = fs.readFileSync(filePath, 'utf-8')
    
    console.log(`Executing ${sqlFile}...`)
    const { error } = await supabase.rpc('exec', { sql })
    
    if (error) {
      console.error(`Error executing ${sqlFile}:`, error.message)
      return false
    }
    
    console.log(`✓ ${sqlFile} executed successfully`)
    return true
  } catch (err) {
    console.error(`Failed to execute ${sqlFile}:`, err.message)
    return false
  }
}

async function main() {
  console.log('Setting up Nepali News Platform database...\n')
  
  // Execute migrations in order
  const migrations = [
    '001_create_articles_table.sql',
    '002_create_profiles_table.sql'
  ]
  
  let allSuccess = true
  for (const migration of migrations) {
    const success = await executeSql(migration)
    if (!success) allSuccess = false
  }
  
  if (allSuccess) {
    console.log('\n✓ Database setup completed successfully!')
  } else {
    console.log('\n✗ Some migrations failed. Please check the errors above.')
    process.exit(1)
  }
}

main()
