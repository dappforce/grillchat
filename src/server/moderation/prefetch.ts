export {}

// export async function prefetchBlockedEntities(
//   queryClient: QueryClient,
//   hubId: string,
//   chatIds: string[]
// ) {
//   try {
//     return await Promise.all([
//       getBlockedCids(queryClient, { hubId }),
//       getBlockedAddresses(queryClient, { hubId }),
//       ...chatIds.map((chatId) =>
//         getBlockedMessageIdsInChatIdQuery.fetchQuery(queryClient, {
//           chatId,
//           hubId,
//         })
//       ),
//     ])
//   } catch (err) {
//     console.log('Error prefetching blocked entities', err)
//   }
// }
