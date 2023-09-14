package util

import (
	"github.com/stretchr/testify/require"
	"testing"
)

func TestCalculateCorrectPack(t *testing.T) {
	testCases := []struct {
		name                              string
		packSizes                         []AvailablePackSize
		requestedItemCount                int
		expectedCalculatedItemQuantitySum int
		expectedCalculatedItems           []CalculatedItems
	}{
		{
			name:                              "When the requested item count is 12001",
			packSizes:                         getDummyPackSizes(),
			requestedItemCount:                12001,
			expectedCalculatedItemQuantitySum: 12250,
			expectedCalculatedItems: []CalculatedItems{
				{
					PackSize: &AvailablePackSize{
						PackSizeId:   2,
						PackQuantity: 5000,
					},
					Quantity: 2,
				},
				{
					PackSize: &AvailablePackSize{
						PackSizeId:   5,
						PackQuantity: 2000,
					},
					Quantity: 1,
				},
				{
					PackSize: &AvailablePackSize{
						PackSizeId:   3,
						PackQuantity: 250,
					},
					Quantity: 1,
				},
			},
		},
		{
			name:                              "When the requested item count is 501",
			packSizes:                         getDummyPackSizes(),
			requestedItemCount:                501,
			expectedCalculatedItemQuantitySum: 750,
			expectedCalculatedItems: []CalculatedItems{
				{
					PackSize: &AvailablePackSize{
						PackSizeId:   1,
						PackQuantity: 500,
					},
					Quantity: 1,
				},
				{
					PackSize: &AvailablePackSize{
						PackSizeId:   3,
						PackQuantity: 250,
					},
					Quantity: 1,
				},
			},
		},

		{
			name:                              "When the requested item count is 251",
			packSizes:                         getDummyPackSizes(),
			requestedItemCount:                251,
			expectedCalculatedItemQuantitySum: 500,
			expectedCalculatedItems: []CalculatedItems{{
				PackSize: &AvailablePackSize{
					PackSizeId:   1,
					PackQuantity: 500,
				},
				Quantity: 1,
			}},
		},
		{
			name:                              "When the requested item count is 250",
			packSizes:                         getDummyPackSizes(),
			requestedItemCount:                250,
			expectedCalculatedItemQuantitySum: 250,
			expectedCalculatedItems: []CalculatedItems{{
				PackSize: &AvailablePackSize{
					PackSizeId:   3,
					PackQuantity: 250,
				},
				Quantity: 1,
			}},
		},
		{
			name:                              "When the requested item count is 1",
			packSizes:                         getDummyPackSizes(),
			requestedItemCount:                1,
			expectedCalculatedItemQuantitySum: 250,
			expectedCalculatedItems: []CalculatedItems{{
				PackSize: &AvailablePackSize{
					PackSizeId:   3,
					PackQuantity: 250,
				},
				Quantity: 1,
			}},
		},
		{
			name:                              "Zero Requested Item Case",
			packSizes:                         []AvailablePackSize{},
			requestedItemCount:                0,
			expectedCalculatedItemQuantitySum: 0,
			expectedCalculatedItems:           []CalculatedItems{},
		},
		{
			name:                              "Empty Pack Sizes Case",
			packSizes:                         []AvailablePackSize{},
			requestedItemCount:                400,
			expectedCalculatedItemQuantitySum: 0,
			expectedCalculatedItems:           []CalculatedItems{},
		},
	}

	for i := range testCases {
		tc := testCases[i]

		t.Run(tc.name, func(t *testing.T) {
			container := NewPackSizeContainer(tc.requestedItemCount, tc.packSizes)
			container.Perform()
			require.Equal(t, tc.expectedCalculatedItemQuantitySum, container.CalculatedItemQuantitySum)
			require.Equal(t, len(tc.expectedCalculatedItems), len(container.CalculatedItems))

			for index, item := range tc.expectedCalculatedItems {
				require.Equal(t, item.Quantity, container.CalculatedItems[index].Quantity)
				require.Equal(t, item.PackSize.PackSizeId, container.CalculatedItems[index].PackSize.PackSizeId)
				require.Equal(t, item.PackSize.PackQuantity, container.CalculatedItems[index].PackSize.PackQuantity)
			}
		})

	}
}

func getDummyPackSizes() []AvailablePackSize {
	return []AvailablePackSize{
		{
			PackSizeId:   5, // it will represent db ids, there is no relation with algorithm
			PackQuantity: 2000,
		},
		{
			PackSizeId:   4, // it will represent db ids, there is no relation with algorithm
			PackQuantity: 1000,
		},
		{
			PackSizeId:   3, // it will represent db ids, there is no relation with algorithm
			PackQuantity: 250,
		},
		{
			PackSizeId:   2, // it will represent db ids, there is no relation with algorithm
			PackQuantity: 5000,
		},
		{
			PackSizeId:   1, // it will represent db ids, there is no relation with algorithm
			PackQuantity: 500,
		},
	}
}
