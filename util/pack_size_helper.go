package util

import (
	"slices"
	"sort"
)

type AvailablePackSize struct {
	PackSizeId   int
	PackQuantity int
}

type CalculatedItems struct {
	PackSize *AvailablePackSize
	Quantity int
}

type PackSizeContainer struct {
	RequestedItemCount        int
	PackSizes                 []AvailablePackSize
	CalculatedItems           []CalculatedItems
	CalculatedItemQuantitySum int
}

func NewPackSizeContainer(requestedItemCount int, packSizes []AvailablePackSize) *PackSizeContainer {
	return &PackSizeContainer{
		RequestedItemCount: requestedItemCount,
		PackSizes:          packSizes,
	}
}

func (container *PackSizeContainer) Perform() {
	container.calculatePacks()
	container.calculateTotalItemCount()
}

func (container *PackSizeContainer) calculatePacks() {
	if len(container.PackSizes) == 0 || container.RequestedItemCount == 0 {
		return
	}

	container.sortPackSize()

	biggestPackSize := container.findBiggestPackSizeSmallerOrEqualToRequestedSize()
	if biggestPackSize == nil { // that means all available sizes are bigger than the requested size
		smallestPackSize := container.findSmallestPackSize()
		container.addCalculatedItem(smallestPackSize, 1)

		return
	}

	requiredPackCount := container.RequestedItemCount / biggestPackSize.PackQuantity
	container.addCalculatedItem(biggestPackSize, requiredPackCount)

	remainingAmount := container.RequestedItemCount - (requiredPackCount * biggestPackSize.PackQuantity)
	container.RequestedItemCount = remainingAmount
	container.calculatePacks() // we restart the process with the remaining value as recursive
}

func (container *PackSizeContainer) sortPackSize() {
	sort.SliceStable(container.PackSizes, func(i, j int) bool {
		return container.PackSizes[i].PackQuantity > container.PackSizes[j].PackQuantity
	})
}

func (container *PackSizeContainer) addCalculatedItem(packSize *AvailablePackSize, quantity int) {
	existingItem := container.findExistingCalculatedItem(packSize.PackSizeId)
	if existingItem != nil {
		existingItem.Quantity = existingItem.Quantity + quantity
	} else {
		container.CalculatedItems = append(container.CalculatedItems, CalculatedItems{
			PackSize: packSize,
			Quantity: quantity,
		})
	}
}

func (container *PackSizeContainer) findBiggestPackSizeSmallerOrEqualToRequestedSize() *AvailablePackSize {
	index := slices.IndexFunc(container.PackSizes, func(ps AvailablePackSize) bool { return ps.PackQuantity <= container.RequestedItemCount })
	if index != -1 {
		return &container.PackSizes[index]
	}
	return nil
}

func (container *PackSizeContainer) findExistingCalculatedItem(packSizeId int) *CalculatedItems {
	index := slices.IndexFunc(container.CalculatedItems, func(ci CalculatedItems) bool { return ci.PackSize.PackSizeId == packSizeId })
	if index != -1 {
		return &container.CalculatedItems[index]
	}
	return nil
}

func (container *PackSizeContainer) findSmallestPackSize() *AvailablePackSize {
	min := container.PackSizes[0] //assign the first element equal to min
	for _, item := range container.PackSizes {
		if item.PackQuantity < min.PackQuantity {
			min = item
		}
	}
	return &min
}

func (container *PackSizeContainer) calculateTotalItemCount() {
	result := 0
	for _, item := range container.CalculatedItems {
		result += item.Quantity * item.PackSize.PackQuantity
	}
	container.CalculatedItemQuantitySum = result
}
