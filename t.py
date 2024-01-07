import httpx

# Replace with your Supabase API URL and API key
supabase_url = 'https://jowhcvqejuahwkqhdjvs.supabase.co'
supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impvd2hjdnFlanVhaHdrcWhkanZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNDQ4MzE2NywiZXhwIjoyMDIwMDU5MTY3fQ.KRaK6EoUkcuMsHtvNgxKdeevvkapcYxVrKDxhuij71g'

async def fetch_link(id):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f'{supabase_url}/rest/v1/links?id=eq.{id}',
            headers={'apikey': supabase_key}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                return data[0]['link']
        return None

async def main():
    id = input("Enter the ID: ")
    link = await fetch_link(id)

    if link:
        print(f'URL: {link}')
    else:
        print('URL not found')

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
