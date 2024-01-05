/* eslint-disable @typescript-eslint/no-unused-vars */
import TodoList from "../components/TodoList.vue"

describe("TodoList", () => {
  it("global tests", () => {
    const modelValue = [
      { id: "_id_1", label: "Lorem", status: false },
      { id: "_id_2", label: "ipsum", status: false },
      { id: "_id_3", label: "dolor", status: false },
      { id: "_id_4", label: "sit", status: false },
      { id: "_id_5", label: "amet", status: false },
      { id: "_id_6", label: "consectetur", status: false },
    ]

    cy.viewport(800, 600)

    const onModelValueSpy = cy.spy().as("onModelValueSpy")
    const onChangeSpy = cy.spy().as("onChangeSpy")
    const onRemoveSpy = cy.spy().as("onRemoveSpy")
    const onAddItemSpy = cy.spy().as("onAddItemSpy")
    const onUncheckedAllSpy = cy.spy().as("onUncheckedAllSpy")

    cy.mount(TodoList, {
      props: {
        modelValue,
        identifier: "test-ab-c",
        onModelValue: onModelValueSpy,
        onChange: onChangeSpy,
        onRemove: onRemoveSpy,
        onAddItem: onAddItemSpy,
        onUncheckedAll: onUncheckedAllSpy,
      },
    })

    // check add todo then submit and check emit result
    cy.get("input[type=text]").type("Testing ...")
    cy.get("button.btn.btn-primary").eq(0).click()
    cy.get("input[type=text]").should("have.value", "")
    cy.get("@onAddItemSpy").should("have.been.calledWith", "Testing ...")

    // checked all todos
    modelValue.forEach((_, index) => cy.get("input").eq(index).click())

    // reset all todos and check emit result
    cy.get("button.btn.btn-warning").eq(0).click()
    cy.get("@onUncheckedAllSpy").should("have.been.called")

    // remove todo position 1 and check emit result
    cy.get("button.btn.btn-outline-danger").eq(1).click()
    cy.get("@onRemoveSpy").should("have.been.calledWith", modelValue[1])

    // checked pos 2 and check result data
    cy.get("input").eq(2).click()
    // TODO with modelValue doesnt work
    // cy.get("@onModelValueSpy").should("have.been.calledWith", modelValue[2].status)

    // on checked pos 2 check expected strike text
    cy.get("label.cursor-pointer.text-decoration-line-through").should("contain", "dolor")
  })
})
